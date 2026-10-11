from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime

class CalendarEventCreate(BaseModel):
    title: str
    platform: str
    scheduled_at: datetime
    content_id: Optional[str] = None
    style_variant: Optional[str] = "purple"

class CalendarEventItem(BaseModel):
    id: str
    title: str
    time: str
    day: int
    platform: str
    cardStyle: Optional[str] = None
    timeStyle: Optional[str] = None
    iconType: Optional[str] = None

class CalendarResponse(BaseModel):
    events: Dict[str, CalendarEventItem]
