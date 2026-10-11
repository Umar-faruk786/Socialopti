from typing import List, Optional
from pydantic import BaseModel

class ContentAnalysisResponse(BaseModel):
    id: str
    content_id: str
    image_quality: int = 92
    caption_quality: int = 88
    readability: int = 85
    grammar: int = 90
    overall_score: int = 91
    emotion_detected: str = "Positive"
    emotion_confidence: int = 78
    tone: str = "Professional"
    tone_confidence: int = 85
    hashtag_count: int = 7
    hashtag_quality: str = "Good"
    top_keywords: List[str] = ["productivity", "work", "tech", "growth", "study"]
    suggestions: List[str] = [
        "Add a clear call-to-action to boost interaction.",
        "Use 2-3 more trending hashtags related to your niche.",
        "Consider a brighter thumbnail to raise click-through rate."
    ]

    class Config:
        from_attributes = True
