from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Content, Recommendation
from app.schemas.recommendation import RecommendationResponse, BestTimeSchema, AudienceSchema, ImprovementTipSchema
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations"])

@router.get("/latest", response_model=RecommendationResponse)
def get_latest_recommendation(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch the latest content recommendations."""
    latest_content = db.query(Content).filter(Content.user_id == current_user.id).order_by(Content.created_at.desc()).first()
    if not latest_content or not latest_content.recommendation:
        return RecommendationResponse(
            id="default",
            content_id="default",
            improved_caption="Ready to level up your workflow? These 5 AI tools helped me save 10+ hours a week ✨ Swipe to see which one is a game changer →",
            hashtags=["#ProductivityHacks", "#AITools", "#WorkSmarter", "#TechTips", "#GrowthMindset", "#RemoteWork", "#Efficiency"],
            best_time=BestTimeSchema(day="Today", time="8:00 PM", label="high engagement time"),
            audience=AudienceSchema(ageRange="22–34", interests=["Technology", "Productivity", "Startups"], regions=["India", "USA", "UAE"]),
            improvement_tips=[
                ImprovementTipSchema(title="Improve Image", desc="Increase brightness and contrast for better visibility."),
                ImprovementTipSchema(title="Content Tips", desc="Add a call-to-action to improve engagement."),
                ImprovementTipSchema(title="Audience Targeting", desc="Target the right audience for better results.")
            ]
        )
    return latest_content.recommendation

@router.get("/{content_id}", response_model=RecommendationResponse)
def get_recommendation_by_content_id(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve AI Recommendations for a specific content item."""
    content = db.query(Content).filter(Content.id == content_id, Content.user_id == current_user.id).first()
    if not content or not content.recommendation:
        raise HTTPException(status_code=404, detail="Recommendations not found for this content.")
    return content.recommendation
