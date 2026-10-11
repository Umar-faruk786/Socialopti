import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from app.database import Base

class Trend(Base):
    __tablename__ = "trends"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    topic = Column(String(100), nullable=False)
    category = Column(String(50), default="Tech & AI")
    platform = Column(String(50), default="All Platforms")
    volume = Column(Integer, default=50000)
    growth_rate = Column(Float, default=18.5)
    sample_hashtags = Column(JSON, default=list)
    recorded_at = Column(DateTime, default=datetime.utcnow)
