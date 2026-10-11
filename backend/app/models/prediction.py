import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class EngagementPrediction(Base):
    __tablename__ = "engagement_predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content_id = Column(String(36), ForeignKey("contents.id", ondelete="CASCADE"), nullable=False, unique=True)
    total_engagement_score = Column(Integer, default=89)
    reach_probability = Column(Integer, default=82)
    virality_probability = Column(Integer, default=73)
    engagement_probability = Column(Integer, default=89)
    expected_engagement = Column(JSON, default=lambda: {
        "likes": "1.2K – 1.8K",
        "comments": "120 – 250",
        "shares": "80 – 150",
        "reach": "8K – 12K"
    })
    platform_breakdown = Column(JSON, default=lambda: [
        {"platform": "Instagram", "icon": "instagram", "score": 89, "label": "Excellent", "color": "#EC4899"},
        {"platform": "LinkedIn", "icon": "linkedin", "score": 76, "label": "Very Good", "color": "#3B82F6"},
        {"platform": "Facebook", "icon": "facebook", "score": 68, "label": "Good", "color": "#4F65D6"},
        {"platform": "Twitter (X)", "icon": "twitter", "score": 61, "label": "Average", "color": "#111827"},
        {"platform": "YouTube", "icon": "youtube", "score": 83, "label": "Very Good", "color": "#EF4444"}
    ])
    created_at = Column(DateTime, default=datetime.utcnow)

    content = relationship("Content", back_populates="prediction")
