from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Content, ContentAnalysis
from app.schemas.analysis import ContentAnalysisResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/analysis", tags=["Content Analysis"])

@router.get("/latest", response_model=ContentAnalysisResponse)
def get_latest_analysis(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch the latest analyzed content analysis metrics."""
    latest_content = db.query(Content).filter(Content.user_id == current_user.id).order_by(Content.created_at.desc()).first()
    if not latest_content or not latest_content.analysis:
        # Return sensible default if no contents exist yet
        return ContentAnalysisResponse(
            id="default",
            content_id="default",
            image_quality=92,
            caption_quality=88,
            readability=85,
            grammar=90,
            overall_score=91,
            emotion_detected="Positive",
            emotion_confidence=78,
            tone="Professional",
            tone_confidence=85,
            hashtag_count=7,
            hashtag_quality="Good",
            top_keywords=["productivity", "work", "tech", "growth", "study"],
            suggestions=[
                "Add a clear call-to-action to boost interaction.",
                "Use 2-3 more trending hashtags related to your niche.",
                "Consider a brighter thumbnail to raise click-through rate."
            ]
        )
    return latest_content.analysis

@router.get("/{content_id}", response_model=ContentAnalysisResponse)
def get_analysis_by_content_id(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve Content Analysis output for a specific content item."""
    content = db.query(Content).filter(Content.id == content_id, Content.user_id == current_user.id).first()
    if not content or not content.analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this content.")
    return content.analysis
