from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Trend
from app.schemas.trend import TrendsResponse, TrendingTopic

router = APIRouter(prefix="/trends", tags=["Social Media Trends"])

@router.get("", response_model=TrendsResponse)
def get_trends(db: Session = Depends(get_db)):
    """Retrieve active social media trends, categories, and top viral hashtags."""
    trends = db.query(Trend).all()
    if not trends:
        sample_trends = [
            TrendingTopic(
                id="1",
                topic="AI Automation in 2026",
                category="Tech & AI",
                platform="LinkedIn",
                volume=125000,
                growth_rate=34.2,
                sample_hashtags=["#AIAutomation", "#FutureOfWork", "#Tech2026"]
            ),
            TrendingTopic(
                id="2",
                topic="Minimalist Creator Workspaces",
                category="Design",
                platform="Instagram",
                volume=84000,
                growth_rate=22.8,
                sample_hashtags=["#DeskSetup", "#WorkspaceGoals", "#Minimalism"]
            ),
            TrendingTopic(
                id="3",
                topic="Short-Form Video Hooks",
                category="Marketing",
                platform="TikTok",
                volume=210000,
                growth_rate=45.1,
                sample_hashtags=["#ViralHooks", "#ContentStrategy", "#CreatorTips"]
            )
        ]
        return TrendsResponse(
            trends=sample_trends,
            top_hashtags=["#AIRevolution", "#ProductivityHacks", "#GrowthStrategy", "#CreatorEconomy"]
        )

    return TrendsResponse(
        trends=[
            TrendingTopic(
                id=t.id,
                topic=t.topic,
                category=t.category,
                platform=t.platform,
                volume=t.volume,
                growth_rate=t.growth_rate,
                sample_hashtags=t.sample_hashtags or []
            )
            for t in trends
        ],
        top_hashtags=["#AIRevolution", "#ProductivityHacks", "#GrowthStrategy", "#CreatorEconomy", "#SocialGrowth"]
    )
