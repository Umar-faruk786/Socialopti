from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import (
    User, UserProfile, UserSettings, SocialAccount,
    Content, ContentAnalysis, Recommendation, EngagementPrediction,
    AnalyticsSummary, Trend, ScheduledPost
)
from app.utils.security import get_password_hash

def seed_database(db: Session):
    """Seed initial data if database is empty."""
    # Check if default user exists
    existing_user = db.query(User).filter(User.email == "umarfaruk@example.com").first()
    if existing_user:
        return

    # 1. Create Default User
    user = User(
        email="umarfaruk@example.com",
        hashed_password=get_password_hash("password123"),
        role="Admin",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. User Profile
    profile = UserProfile(
        user_id=user.id,
        full_name="Umar Faruk",
        phone="+91 98765 43210",
        bio="Passionate about AI, Tech and Content Creation.",
        avatar_url="https://i.pravatar.cc/150?img=13"
    )
    db.add(profile)

    # 3. User Settings
    settings = UserSettings(
        user_id=user.id,
        theme="light",
        email_notifications=True,
        push_notifications=True,
        weekly_digest=False,
        marketing_updates=False
    )
    db.add(settings)

    # 4. Social Accounts
    accounts_data = [
        {"platform": "Instagram", "handle": "@umarfaruk.tech", "is_connected": True},
        {"platform": "LinkedIn", "handle": "Umar Faruk", "is_connected": True},
        {"platform": "Facebook", "handle": "Not Connected", "is_connected": False},
        {"platform": "Twitter (X)", "handle": "@umarfaruk_dev", "is_connected": True},
        {"platform": "YouTube", "handle": "Not Connected", "is_connected": False},
    ]
    for acc in accounts_data:
        db.add(SocialAccount(user_id=user.id, **acc))

    # 5. Analytics Summary
    summary = AnalyticsSummary(
        user_id=user.id,
        total_analyses=128,
        avg_content_score=87,
        engagement_score=76,
        total_reach="245K",
        predicted_posts=56,
        total_engagement="18.6K",
        avg_engagement_rate="7.6%"
    )
    db.add(summary)

    # 6. Sample Trends
    sample_trends = [
        {"topic": "AI Automation in 2026", "category": "Tech & AI", "platform": "LinkedIn", "volume": 125000, "growth_rate": 34.2, "sample_hashtags": ["#AIAutomation", "#FutureOfWork", "#Tech2026"]},
        {"topic": "Minimalist Creator Workspaces", "category": "Design", "platform": "Instagram", "volume": 84000, "growth_rate": 22.8, "sample_hashtags": ["#DeskSetup", "#WorkspaceGoals", "#Minimalism"]},
        {"topic": "Short-Form Video Hooks", "category": "Marketing", "platform": "TikTok", "volume": 210000, "growth_rate": 45.1, "sample_hashtags": ["#ViralHooks", "#ContentStrategy", "#CreatorTips"]},
        {"topic": "Sustainable Smart Architecture", "category": "Architecture", "platform": "All Platforms", "volume": 62000, "growth_rate": 18.4, "sample_hashtags": ["#SmartCities", "#GreenArchitecture", "#UrbanDesign"]},
    ]
    for t in sample_trends:
        db.add(Trend(**t))

    # 7. Sample Initial Content & History
    initial_posts = [
        {
            "title": "New Product Launch Post",
            "caption": "Transforming workflows with next-gen AI automation. 🚀 Excited to introduce our newest tool designed to save 10+ hours every single week.\n\nWhich feature are you most excited to try first? 👇",
            "media_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop",
            "media_type": "image/jpeg",
            "aspect_ratio": "1:1 Square",
            "platforms": ["instagram", "linkedin"],
            "hashtags": ["#AIRevolution", "#Productivity", "#TechTrends"],
            "goal": "engagement",
            "status": "analyzed",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "content_score": 92,
            "engagement_score": 89
        },
        {
            "title": "AI Tools Carousel",
            "caption": "Ready to level up your workflow? These 5 AI tools helped me save 10+ hours a week ✨ Swipe to see which one is a game changer →",
            "media_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop",
            "media_type": "image/jpeg",
            "aspect_ratio": "4:5 Portrait",
            "platforms": ["linkedin"],
            "hashtags": ["#AITools", "#WorkSmarter", "#ProductivityHacks"],
            "goal": "reach",
            "status": "analyzed",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "content_score": 85,
            "engagement_score": 76
        },
        {
            "title": "Motivational Quote",
            "caption": "Success is the sum of small efforts repeated day in and day out. What is your #1 goal this week?",
            "media_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=800&fit=crop",
            "media_type": "image/jpeg",
            "aspect_ratio": "16:9 Landscape",
            "platforms": ["facebook", "twitter"],
            "hashtags": ["#Motivation", "#GrowthMindset"],
            "goal": "engagement",
            "status": "analyzed",
            "created_at": datetime.utcnow() - timedelta(days=3),
            "content_score": 78,
            "engagement_score": 68
        },
        {
            "title": "Study Tips Video",
            "caption": "Top study techniques for tech engineers: Active recall and Pomodoro simplified.",
            "media_url": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=800&fit=crop",
            "media_type": "video/mp4",
            "aspect_ratio": "16:9 Video",
            "platforms": ["youtube"],
            "hashtags": ["#StudyTips", "#Engineering"],
            "goal": "reach",
            "status": "analyzed",
            "created_at": datetime.utcnow() - timedelta(days=4),
            "content_score": 88,
            "engagement_score": 83
        },
        {
            "title": "Behind the Scenes",
            "caption": "A quick look at what goes into building intelligent multi-agent AI systems from scratch!",
            "media_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
            "media_type": "image/jpeg",
            "aspect_ratio": "1:1 Square",
            "platforms": ["instagram"],
            "hashtags": ["#BehindTheScenes", "#TechStartup"],
            "goal": "engagement",
            "status": "analyzed",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "content_score": 90,
            "engagement_score": 87
        }
    ]

    for p in initial_posts:
        c = Content(
            user_id=user.id,
            title=p["title"],
            caption=p["caption"],
            media_url=p["media_url"],
            media_type=p["media_type"],
            aspect_ratio=p["aspect_ratio"],
            platforms=p["platforms"],
            hashtags=p["hashtags"],
            goal=p["goal"],
            status=p["status"],
            created_at=p["created_at"]
        )
        db.add(c)
        db.commit()
        db.refresh(c)

        # Add Content Analysis
        analysis = ContentAnalysis(
            content_id=c.id,
            overall_score=p["content_score"],
            image_quality=p["content_score"] + 2 if p["content_score"] <= 97 else 98,
            caption_quality=p["content_score"] - 2,
            readability=86,
            grammar=91,
            emotion_detected="Positive",
            emotion_confidence=82,
            tone="Professional" if "linkedin" in p["platforms"] else "Inspirational",
            tone_confidence=87,
            hashtag_count=len(p["hashtags"]),
            hashtag_quality="Good",
            top_keywords=["productivity", "automation", "tech", "growth", "workflow"],
            suggestions=[
                "Add a direct call-to-action question at the end.",
                "Use 3-5 niche hashtags alongside broad category tags.",
                "Optimal post timing for this category is 8:00 PM."
            ]
        )
        db.add(analysis)

        # Add Recommendation
        rec = Recommendation(
            content_id=c.id,
            improved_caption=p["caption"] + "\n\nSave this post for your weekly planning! 📌",
            hashtags=p["hashtags"] + ["#CreatorEconomy", "#SocialGrowth"],
            best_time={"day": "Today", "time": "8:00 PM", "label": "high engagement time"},
            audience={"ageRange": "22–34", "interests": ["Technology", "Productivity", "Startups"], "regions": ["India", "USA", "UAE"]},
            improvement_tips=[
                {"title": "Improve Image", "desc": "Increase brightness and contrast for better mobile feed visibility."},
                {"title": "Content Tips", "desc": "Add a clear interactive call-to-action to boost comment velocity."},
                {"title": "Audience Targeting", "desc": "Target tech enthusiasts and active professionals during peak hours."}
            ]
        )
        db.add(rec)

        # Add Engagement Prediction
        pred = EngagementPrediction(
            content_id=c.id,
            total_engagement_score=p["engagement_score"],
            reach_probability=84,
            virality_probability=75,
            engagement_probability=p["engagement_score"],
            expected_engagement={
                "likes": "1.2K – 1.8K",
                "comments": "120 – 250",
                "shares": "80 – 150",
                "reach": "8K – 12K"
            },
            platform_breakdown=[
                {"platform": "Instagram", "icon": "instagram", "score": p["engagement_score"], "label": "Excellent" if p["engagement_score"]>=85 else "Very Good", "color": "#EC4899"},
                {"platform": "LinkedIn", "icon": "linkedin", "score": max(60, p["engagement_score"]-10), "label": "Very Good", "color": "#3B82F6"},
                {"platform": "Facebook", "icon": "facebook", "score": max(55, p["engagement_score"]-18), "label": "Good", "color": "#4F65D6"},
                {"platform": "Twitter (X)", "icon": "twitter", "score": max(50, p["engagement_score"]-22), "label": "Average", "color": "#111827"},
                {"platform": "YouTube", "icon": "youtube", "score": max(65, p["engagement_score"]-6), "label": "Very Good", "color": "#EF4444"}
            ]
        )
        db.add(pred)

    # 8. Sample Calendar Scheduled Posts
    sample_calendar = [
        {"title": "Product Teaser", "platform": "Instagram", "day": 1, "time": "10:00 AM", "style": "purple", "icon": "instagram"},
        {"title": "Poll: New Feature", "platform": "Instagram", "day": 3, "time": "01:00 PM", "style": "emerald", "icon": "sliders"},
        {"title": "Industry Insights", "platform": "LinkedIn", "day": 6, "time": "11:30 AM", "style": "blue", "icon": "linkedin"},
        {"title": "Tutorial Video", "platform": "YouTube", "day": 10, "time": "04:00 PM", "style": "red", "icon": "youtube"},
        {"title": "Weekly Roundup", "platform": "LinkedIn", "day": 12, "time": "09:00 AM", "style": "blue", "icon": "linkedin"},
        {"title": "Behind the Scenes", "platform": "Instagram", "day": 15, "time": "02:00 PM", "style": "purple", "icon": "instagram"},
        {"title": "Poll: Content Type", "platform": "Instagram", "day": 18, "time": "12:00 PM", "style": "emerald", "icon": "sliders"},
        {"title": "Case Study", "platform": "LinkedIn", "day": 22, "time": "03:30 PM", "style": "blue", "icon": "linkedin"},
    ]
    for sc in sample_calendar:
        scheduled_dt = datetime.utcnow().replace(day=sc["day"], hour=int(sc["time"].split(":")[0]) % 12 + (12 if "PM" in sc["time"] else 0), minute=0)
        sp = ScheduledPost(
            user_id=user.id,
            title=sc["title"],
            platform=sc["platform"],
            scheduled_at=scheduled_dt,
            style_variant=sc["style"],
            icon_type=sc["icon"]
        )
        db.add(sp)

    db.commit()

def init_db():
    """Initializes database tables and seeds initial data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
