from typing import List
from pydantic import BaseModel

class TrendingTopic(BaseModel):
    id: str
    topic: str
    category: str
    platform: str
    volume: int
    growth_rate: float
    sample_hashtags: List[str]

class TrendsResponse(BaseModel):
    trends: List[TrendingTopic]
    top_hashtags: List[str]
