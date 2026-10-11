from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Content, EngagementPrediction
from app.schemas.prediction import EngagementPredictionResponse, ExpectedEngagementMetrics, PlatformPredictionItem
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/prediction", tags=["Engagement Prediction"])

@router.get("/latest", response_model=EngagementPredictionResponse)
def get_latest_prediction(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch the latest engagement prediction."""
    latest_content = db.query(Content).filter(Content.user_id == current_user.id).order_by(Content.created_at.desc()).first()
    if not latest_content or not latest_content.prediction:
        return EngagementPredictionResponse(
            id="default",
            content_id="default",
            total_engagement_score=89,
            reach_probability=82,
            virality_probability=73,
            engagement_probability=89,
            expected_engagement=ExpectedEngagementMetrics(
                likes="1.2K – 1.8K",
                comments="120 – 250",
                shares="80 – 150",
                reach="8K – 12K"
            ),
            platform_breakdown=[
                PlatformPredictionItem(platform="Instagram", icon="instagram", score=89, label="Excellent", color="#EC4899"),
                PlatformPredictionItem(platform="LinkedIn", icon="linkedin", score=76, label="Very Good", color="#3B82F6"),
                PlatformPredictionItem(platform="Facebook", icon="facebook", score=68, label="Good", color="#4F65D6"),
                PlatformPredictionItem(platform="Twitter (X)", icon="twitter", score=61, label="Average", color="#111827"),
                PlatformPredictionItem(platform="YouTube", icon="youtube", score=83, label="Very Good", color="#EF4444")
            ]
        )
    return latest_content.prediction

@router.get("/{content_id}", response_model=EngagementPredictionResponse)
def get_prediction_by_content_id(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve Engagement Prediction for a specific content item."""
    content = db.query(Content).filter(Content.id == content_id, Content.user_id == current_user.id).first()
    if not content or not content.prediction:
        raise HTTPException(status_code=404, detail="Prediction not found for this content.")
    return content.prediction
