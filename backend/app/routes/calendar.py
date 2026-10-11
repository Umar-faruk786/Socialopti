from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, ScheduledPost
from app.schemas.calendar import CalendarResponse, CalendarEventItem, CalendarEventCreate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/calendar", tags=["Content Calendar"])

@router.get("/events")
def get_calendar_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve scheduled posts and content calendar events."""
    posts = db.query(ScheduledPost).filter(ScheduledPost.user_id == current_user.id).all()

    # Formatted calendar dictionary matching frontend calendar expectation
    events_map = {}
    for p in posts:
        day_key = str(p.scheduled_at.day)
        time_str = p.scheduled_at.strftime("%I:%M %p")

        style = p.style_variant or "purple"
        if style == "purple":
            card_style = "bg-[#F4EFFE] dark:bg-purple-950/30 border-purple-100 dark:border-purple-800/40 text-slate-900 dark:text-white"
            time_style = "text-purple-600 dark:text-purple-400"
        elif style == "emerald":
            card_style = "bg-[#EEFCEF] dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/40 text-slate-900 dark:text-white"
            time_style = "text-emerald-600 dark:text-emerald-400"
        elif style == "blue":
            card_style = "bg-[#EDF5FF] dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/40 text-slate-900 dark:text-white"
            time_style = "text-blue-600 dark:text-blue-400"
        else:
            card_style = "bg-[#FFF0F0] dark:bg-red-950/30 border-red-100 dark:border-red-800/40 text-slate-900 dark:text-white"
            time_style = "text-red-500 dark:text-red-400"

        events_map[day_key] = {
            "id": p.id,
            "title": p.title,
            "time": time_str,
            "platform": p.platform,
            "cardStyle": card_style,
            "timeStyle": time_style,
            "icon": p.icon_type or p.platform.lower()
        }

    return events_map

@router.post("/events")
def create_calendar_event(
    req: CalendarEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new scheduled post to calendar."""
    sp = ScheduledPost(
        user_id=current_user.id,
        content_id=req.content_id,
        title=req.title,
        platform=req.platform,
        scheduled_at=req.scheduled_at,
        style_variant=req.style_variant or "purple",
        icon_type=req.platform.lower()
    )
    db.add(sp)
    db.commit()
    db.refresh(sp)
    return {"message": "Event scheduled successfully", "id": sp.id}
