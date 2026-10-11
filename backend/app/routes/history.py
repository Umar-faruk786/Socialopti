from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import User
from app.schemas.history import HistoryListResponse
from app.services.auth_service import get_current_user
from app.services.content_service import get_user_content_list

router = APIRouter(prefix="/history", tags=["Content History"])

@router.get("", response_model=HistoryListResponse)
def get_history(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=6, ge=1, le=50),
    query: Optional[str] = Query(default=None),
    platform: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve paginated, searchable history of all analyzed content."""
    items, total = get_user_content_list(db, current_user, page, page_size, query, platform)
    total_pages = max(1, (total + page_size - 1) // page_size)
    return HistoryListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )
