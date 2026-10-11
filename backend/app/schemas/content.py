from typing import Optional, List, Any
from pydantic import BaseModel
from datetime import datetime
from app.schemas.analysis import ContentAnalysisResponse
from app.schemas.recommendation import RecommendationResponse
from app.schemas.prediction import EngagementPredictionResponse

class ContentCreateRequest(BaseModel):
    title: Optional[str] = None
    caption: str
    media_url: Optional[str] = None
    media_name: Optional[str] = None
    media_type: Optional[str] = "image/jpeg"
    aspect_ratio: Optional[str] = "1:1 Square"
    file_size: Optional[str] = "2.4 MB"
    dimensions: Optional[str] = "1080 × 1080"
    platforms: List[str] = ["instagram", "linkedin"]
    hashtags: List[str] = []
    goal: Optional[str] = "engagement"

class ContentResponse(BaseModel):
    id: str
    title: str
    caption: str
    media_url: Optional[str] = None
    media_name: Optional[str] = None
    media_type: str
    aspect_ratio: str
    file_size: str
    dimensions: str
    platforms: List[str]
    hashtags: List[str]
    goal: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FullOptimizationResponse(BaseModel):
    content: ContentResponse
    analysis: ContentAnalysisResponse
    recommendations: RecommendationResponse
    prediction: EngagementPredictionResponse

    class Config:
        from_attributes = True
