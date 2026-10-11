from typing import List, Optional, Any
from pydantic import BaseModel

class HistoryItem(BaseModel):
    id: Any
    title: str
    platform: str
    contentScore: int
    engagementScore: int
    date: str
    image: Optional[str] = None
    mediaType: Optional[str] = "image"

class HistoryListResponse(BaseModel):
    items: List[HistoryItem]
    total: int
    page: int
    page_size: int
    total_pages: int
