import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class ContentAnalysis(Base):
    __tablename__ = "content_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content_id = Column(String(36), ForeignKey("contents.id", ondelete="CASCADE"), nullable=False, unique=True)
    overall_score = Column(Integer, default=90)
    image_quality = Column(Integer, default=92)
    caption_quality = Column(Integer, default=88)
    readability = Column(Integer, default=85)
    grammar = Column(Integer, default=90)
    emotion_detected = Column(String(50), default="Positive")
    emotion_confidence = Column(Integer, default=78)
    tone = Column(String(50), default="Professional")
    tone_confidence = Column(Integer, default=85)
    hashtag_count = Column(Integer, default=7)
    hashtag_quality = Column(String(50), default="Good")
    top_keywords = Column(JSON, default=lambda: ["productivity", "work", "tech", "growth", "study"])
    suggestions = Column(JSON, default=lambda: [
        "Add a clear call-to-action to boost interaction.",
        "Use 2-3 more trending hashtags related to your niche.",
        "Consider a brighter thumbnail to raise click-through rate."
    ])
    created_at = Column(DateTime, default=datetime.utcnow)

    content = relationship("Content", back_populates="analysis")
