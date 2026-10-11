from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.content import router as content_router
from app.routes.analysis import router as analysis_router
from app.routes.recommendations import router as recommendations_router
from app.routes.prediction import router as prediction_router
from app.routes.analytics import router as analytics_router
from app.routes.history import router as history_router
from app.routes.trends import router as trends_router
from app.routes.calendar import router as calendar_router

__all__ = [
    "auth_router",
    "profile_router",
    "content_router",
    "analysis_router",
    "recommendations_router",
    "prediction_router",
    "analytics_router",
    "history_router",
    "trends_router",
    "calendar_router"
]
