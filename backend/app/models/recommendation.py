import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content_id = Column(String(36), ForeignKey("contents.id", ondelete="CASCADE"), nullable=False, unique=True)
    improved_caption = Column(Text, nullable=False)
    hashtags = Column(JSON, default=list)
    best_time = Column(JSON, default=dict) # {"day": "Today", "time": "8:00 PM", "label": "high engagement time"}
    audience = Column(JSON, default=dict)  # {"ageRange": "22–34", "interests": [...], "regions": [...]}
    improvement_tips = Column(JSON, default=list) # [{"title": "...", "desc": "..."}]
    created_at = Column(DateTime, default=datetime.utcnow)

    content = relationship("Content", back_populates="recommendation")
