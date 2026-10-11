from typing import List, Dict, Any, Union
from pydantic import BaseModel

class PlatformPredictionItem(BaseModel):
    platform: str
    icon: str
    score: int
    label: str
    color: str

    class Config:
        from_attributes = True

class ExpectedEngagementMetrics(BaseModel):
    likes: str
    comments: str
    shares: str
    reach: str

    class Config:
        from_attributes = True

class PredictionOverviewMetrics(BaseModel):
    totalEngagementScore: int
    reachProbability: int
    viralityProbability: int
    engagementProbability: int

    class Config:
        from_attributes = True

class EngagementPredictionResponse(BaseModel):
    id: str
    content_id: str
    total_engagement_score: int
    reach_probability: int
    virality_probability: int
    engagement_probability: int
    expected_engagement: Union[ExpectedEngagementMetrics, Dict[str, Any]]
    platform_breakdown: Union[List[PlatformPredictionItem], List[Dict[str, Any]]]

    class Config:
        from_attributes = True
