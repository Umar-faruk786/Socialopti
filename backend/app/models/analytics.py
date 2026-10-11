import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from app.database import Base

class AnalyticsSummary(Base):
    __tablename__ = "analytics_summaries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    total_analyses = Column(Integer, default=128)
    avg_content_score = Column(Integer, default=87)
    engagement_score = Column(Integer, default=76)
    total_reach = Column(String(50), default="245K")
    predicted_posts = Column(Integer, default=56)
    total_engagement = Column(String(50), default="18.6K")
    avg_engagement_rate = Column(String(50), default="7.6%")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DailyMetric(Base):
    __tablename__ = "daily_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    day = Column(String(10), nullable=False) # Mon, Tue, Wed, ...
    engagement = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    content_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
