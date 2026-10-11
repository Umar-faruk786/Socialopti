from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Content, ContentAnalysis, Recommendation, EngagementPrediction, User
from app.schemas.content import ContentCreateRequest
from app.agents.coordinator import agent_coordinator

async def create_and_optimize_content(db: Session, user: User, req: ContentCreateRequest) -> dict:
    """
    Creates a new Content entity, orchestrates all 6 agents via MultiAgentCoordinator,
    and persists analysis, recommendations, and predictions in PostgreSQL/SQLite.
    """
    # 1. Derive title if not explicitly provided
    title = req.title
    if not title:
        first_line = req.caption.strip().split("\n")[0]
        title = first_line[:40] + ("..." if len(first_line) > 40 else "") if first_line else "Social Post"

    content = Content(
        user_id=user.id,
        title=title,
        caption=req.caption,
        media_url=req.media_url,
        media_name=req.media_name or "content_asset.jpg",
        media_type=req.media_type or "image/jpeg",
        aspect_ratio=req.aspect_ratio or "1:1 Square",
        file_size=req.file_size or "2.4 MB",
        dimensions=req.dimensions or "1080 × 1080",
        platforms=req.platforms or ["instagram", "linkedin"],
        hashtags=req.hashtags or [],
        goal=req.goal or "engagement",
        status="analyzed"
    )
    db.add(content)
    db.commit()
    db.refresh(content)

    # 2. Retrieve recent post history for the current user to calibrate predictions
    recent_posts = (
        db.query(Content)
        .filter(Content.user_id == user.id, Content.id != content.id)
        .order_by(desc(Content.created_at))
        .limit(5)
        .all()
    )
    post_history = []
    for p in recent_posts:
        if p.analysis and p.prediction:
            post_history.append({
                "content_id": p.id,
                "content_score": p.analysis.overall_score,
                "engagement_score": p.prediction.total_engagement_score,
                "reach_probability": p.prediction.reach_probability,
                "platform": p.platforms[0] if p.platforms else "instagram",
                "goal": p.goal
            })

    # Run Multi-Agent AI Pipeline
    agent_input = {
        "content_id": content.id,
        "title": content.title,
        "caption": content.caption,
        "media_type": content.media_type,
        "media_url": content.media_url,
        "media_name": content.media_name,
        "aspect_ratio": content.aspect_ratio,
        "platforms": content.platforms,
        "hashtags": content.hashtags,
        "goal": content.goal,
        "post_history": post_history
    }
    agent_results = await agent_coordinator.run_full_pipeline(agent_input)

    # 3. Persist Analysis Output
    analysis_res = agent_results["analysis"]
    analysis = ContentAnalysis(
        content_id=content.id,
        overall_score=analysis_res["overall_score"],
        image_quality=analysis_res["image_quality"],
        caption_quality=analysis_res["caption_quality"],
        readability=analysis_res["readability"],
        grammar=analysis_res["grammar"],
        emotion_detected=analysis_res["emotion_detected"],
        emotion_confidence=analysis_res["emotion_confidence"],
        tone=analysis_res["tone"],
        tone_confidence=analysis_res["tone_confidence"],
        hashtag_count=analysis_res["hashtag_count"],
        hashtag_quality=analysis_res["hashtag_quality"],
        top_keywords=analysis_res["top_keywords"],
        suggestions=analysis_res["suggestions"]
    )
    db.add(analysis)

    # 4. Persist Recommendation Output
    rec_res = agent_results["recommendations"]
    recommendation = Recommendation(
        content_id=content.id,
        improved_caption=rec_res["improved_caption"],
        hashtags=rec_res["hashtags"],
        best_time=rec_res["best_time"],
        audience=rec_res["audience"],
        improvement_tips=rec_res["improvement_tips"]
    )
    db.add(recommendation)

    # 5. Persist Prediction Output
    pred_res = agent_results["prediction"]
    prediction = EngagementPrediction(
        content_id=content.id,
        total_engagement_score=pred_res["total_engagement_score"],
        reach_probability=pred_res["reach_probability"],
        virality_probability=pred_res["virality_probability"],
        engagement_probability=pred_res["engagement_probability"],
        expected_engagement=pred_res["expected_engagement"],
        platform_breakdown=pred_res["platform_breakdown"]
    )
    db.add(prediction)

    db.commit()
    db.refresh(analysis)
    db.refresh(recommendation)
    db.refresh(prediction)

    return {
        "content": content,
        "analysis": analysis,
        "recommendations": recommendation,
        "prediction": prediction
    }

def get_user_content_list(
    db: Session,
    user: User,
    page: int = 1,
    page_size: int = 6,
    query: Optional[str] = None,
    platform: Optional[str] = None
) -> Tuple[List[dict], int]:
    """Retrieves paginated, filtered content list for history table."""
    q = db.query(Content).filter(Content.user_id == user.id)

    if query:
        q = q.filter(Content.title.ilike(f"%{query}%") | Content.caption.ilike(f"%{query}%"))

    contents = q.order_by(desc(Content.created_at)).all()

    # Filter platform in python (since JSON array storage)
    if platform and platform != "All Platforms":
        contents = [
            c for c in contents
            if any(platform.lower().startswith(p.lower()[:4]) for p in (c.platforms or []))
        ]

    total = len(contents)
    start_idx = (page - 1) * page_size
    paged_items = contents[start_idx : start_idx + page_size]

    formatted = []
    for c in paged_items:
        primary_platform = c.platforms[0].capitalize() if c.platforms else "Instagram"
        content_score = c.analysis.overall_score if c.analysis else 88
        engagement_score = c.prediction.total_engagement_score if c.prediction else 85
        formatted.append({
            "id": c.id,
            "title": c.title,
            "platform": primary_platform,
            "contentScore": content_score,
            "engagementScore": engagement_score,
            "date": c.created_at.strftime("%b %d, %Y"),
            "image": c.media_url or "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop",
            "mediaType": "video" if "video" in (c.media_type or "") else "image"
        })

    return formatted, total

def get_content_by_id(db: Session, content_id: str, user: User) -> Optional[Content]:
    return db.query(Content).filter(Content.id == content_id, Content.user_id == user.id).first()

def delete_content(db: Session, content_id: str, user: User) -> bool:
    content = get_content_by_id(db, content_id, user)
    if not content:
        return False
    db.delete(content)
    db.commit()
    return True
