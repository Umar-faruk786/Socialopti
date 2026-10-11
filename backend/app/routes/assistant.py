import logging
from typing import Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas.assistant import (
    AssistantChatRequest,
    AssistantChatResponse,
    AssistantSuggestionsResponse
)
from app.services.auth_service import decode_access_token
from app.services.assistant_service import assistant_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])

def get_optional_current_user(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """Retrieves user if a valid Bearer token is provided, otherwise returns None."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:].strip()
    if not token or token == "dummy-token":
        return None
    try:
        payload = decode_access_token(token)
        if not payload:
            return None
        user_id = payload.get("sub")
        if not user_id:
            return None
        return db.query(User).filter(User.id == user_id).first()
    except Exception as e:
        logger.debug(f"Optional user retrieval skipped: {e}")
        return None

@router.post("/chat", response_model=AssistantChatResponse)
async def chat_with_assistant(
    req: AssistantChatRequest,
    user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Direct conversational interface with SocialOpti AI (powered by Google Gemini).
    Provides realtime caption crafting, hook creation, hashtag recommendations,
    and engagement growth strategy.
    """
    user_name = None
    if user and hasattr(user, "profile") and user.profile:
        user_name = user.profile.full_name or user.email

    return await assistant_service.chat(
        message=req.message,
        history=req.history,
        platform=req.platform,
        context=req.context,
        user_name=user_name
    )

@router.get("/suggestions", response_model=AssistantSuggestionsResponse)
def get_assistant_suggestions():
    """Retrieve pre-built prompt suggestions for instant one-click queries."""
    return AssistantSuggestionsResponse(
        suggestions=assistant_service.get_quick_suggestions()
    )
