from typing import List, Dict, Any, Union
from pydantic import BaseModel

class BestTimeSchema(BaseModel):
    day: str = "Today"
    time: str = "8:00 PM"
    label: str = "high engagement time"

    class Config:
        from_attributes = True

class AudienceSchema(BaseModel):
    ageRange: str = "22–34"
    interests: List[str] = ["Technology", "Productivity", "Startups"]
    regions: List[str] = ["India", "USA", "UAE"]

    class Config:
        from_attributes = True

class ImprovementTipSchema(BaseModel):
    title: str
    desc: str

    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    id: str
    content_id: str
    improved_caption: str
    hashtags: List[str]
    best_time: Union[BestTimeSchema, Dict[str, Any]]
    audience: Union[AudienceSchema, Dict[str, Any]]
    improvement_tips: Union[List[ImprovementTipSchema], List[Dict[str, Any]]]

    class Config:
        from_attributes = True
