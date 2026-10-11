from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.analytics import DashboardAnalyticsResponse, AnalyticsOverviewResponse
from app.services.auth_service import get_current_user
from app.services.analytics_service import get_dashboard_analytics, get_analytics_overview

router = APIRouter(prefix="/analytics", tags=["Analytics & Reporting"])

@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve summary cards, sparklines, and charts for Dashboard."""
    return get_dashboard_analytics(db, current_user)

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_overview(
    range_filter: str = Query(default="This Month", alias="range"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve in-depth analytics page metrics, historical graphs, and heatmap."""
    return get_analytics_overview(db, current_user, range_filter)
