import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Content(Base):
    __tablename__ = "contents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    caption = Column(Text, nullable=False, default="")
    media_url = Column(String(500), nullable=True)
    media_name = Column(String(255), nullable=True)
    media_type = Column(String(50), default="image/jpeg")
    aspect_ratio = Column(String(50), default="1:1 Square")
    file_size = Column(String(50), default="2.4 MB")
    dimensions = Column(String(50), default="1080 × 1080")
    platforms = Column(JSON, default=list) # ["instagram", "linkedin"]
    hashtags = Column(JSON, default=list)  # ["#AI", "#Productivity"]
    goal = Column(String(50), default="engagement") # engagement, reach, leads, brand_awareness
    status = Column(String(50), default="analyzed") # draft, analyzed, scheduled, published
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="contents")
    analysis = relationship("ContentAnalysis", back_populates="content", uselist=False, cascade="all, delete-orphan")
    recommendation = relationship("Recommendation", back_populates="content", uselist=False, cascade="all, delete-orphan")
    prediction = relationship("EngagementPrediction", back_populates="content", uselist=False, cascade="all, delete-orphan")
    scheduled_post = relationship("ScheduledPost", back_populates="content", uselist=False, cascade="all, delete-orphan")

class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content_id = Column(String(36), ForeignKey("contents.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    platform = Column(String(50), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(String(50), default="pending") # pending, published, cancelled
    icon_type = Column(String(50), default="instagram")
    style_variant = Column(String(50), default="purple")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scheduled_posts")
    content = relationship("Content", back_populates="scheduled_post")
