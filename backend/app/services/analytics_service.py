from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import User, Content, AnalyticsSummary, Trend

def get_dashboard_analytics(db: Session, user: User) -> Dict[str, Any]:
    summary = db.query(AnalyticsSummary).filter(AnalyticsSummary.user_id == user.id).first()

    total_analyses_val = str(max(128, len(user.contents)))
    
    summary_cards = [
        {"id": 1, "label": "Total Analyses", "value": total_analyses_val, "delta": "+18.2%", "trend": "up", "icon": "chart", "color": "blue", "spark": [4, 6, 5, 8, 7, 9, 8, 11, 9, 12]},
        {"id": 2, "label": "Avg. Content Score", "value": f"{summary.avg_content_score if summary else 87}%", "delta": "+9.4%", "trend": "up", "icon": "check", "color": "green", "spark": [7, 7, 8, 7, 9, 8, 9, 10, 9, 10]},
        {"id": 3, "label": "Engagement Score", "value": f"{summary.engagement_score if summary else 76}%", "delta": "+12.7%", "trend": "up", "icon": "smile", "color": "purple", "spark": [5, 6, 6, 7, 6, 8, 7, 8, 9, 8]},
        {"id": 4, "label": "Total Reach", "value": summary.total_reach if summary else "245K", "delta": "+21.5%", "trend": "up", "icon": "users", "color": "orange", "spark": [3, 5, 4, 6, 8, 7, 9, 10, 11, 12]},
        {"id": 5, "label": "Predicted Posts", "value": str(summary.predicted_posts if summary else 56), "delta": "+15.1%", "trend": "up", "icon": "send", "color": "teal", "spark": [6, 5, 7, 6, 8, 7, 9, 8, 10, 9]},
    ]

    engagement_overview = [
        {"day": "Mon", "engagement": 42, "reach": 30},
        {"day": "Tue", "engagement": 58, "reach": 40},
        {"day": "Wed", "engagement": 78, "reach": 55},
        {"day": "Thu", "engagement": 90, "reach": 70},
        {"day": "Fri", "engagement": 65, "reach": 58},
        {"day": "Sat", "engagement": 52, "reach": 45},
        {"day": "Sun", "engagement": 80, "reach": 62},
    ]

    platform_performance = [
        {"name": "Instagram", "value": 42, "color": "#EC4899"},
        {"name": "LinkedIn", "value": 25, "color": "#3B82F6"},
        {"name": "Facebook", "value": 18, "color": "#8B5CF6"},
        {"name": "Twitter (X)", "value": 10, "color": "#111827"},
        {"name": "Others", "value": 5, "color": "#F59E0B"},
    ]

    content_score_distribution = [
        {"name": "90 – 100", "value": 35, "color": "#10B981"},
        {"name": "70 – 89", "value": 40, "color": "#3B82F6"},
        {"name": "50 – 69", "value": 15, "color": "#F59E0B"},
        {"name": "Below 50", "value": 10, "color": "#EF4444"},
    ]

    ai_insights = [
        {"id": 1, "icon": "trend", "bg": "bg-[#F4F1FF]", "iconColor": "text-[#633DF2]", "text": "Your content performs best on Instagram between 7PM – 10PM."},
        {"id": 2, "icon": "bulb", "bg": "bg-[#F0FDF4]", "iconColor": "text-[#10B981]", "text": "Using 5–8 hashtags increases engagement by up to 22%."},
        {"id": 3, "icon": "bar", "bg": "bg-[#FFFBEB]", "iconColor": "text-[#F59E0B]", "text": "Carousel posts get 30% more engagement than single image posts."},
    ]

    return {
        "summaryCards": summary_cards,
        "engagementOverview": engagement_overview,
        "platformPerformance": platform_performance,
        "contentScoreDistribution": content_score_distribution,
        "aiInsights": ai_insights
    }

def get_analytics_overview(db: Session, user: User, range_filter: str = "This Month") -> Dict[str, Any]:
    stats = [
        {"label": "Total Reach", "value": "245K", "delta": "+21.5%", "icon": "users", "color": "bg-accent-orangeLight text-amber-600"},
        {"label": "Total Engagement", "value": "18.6K", "delta": "+14.8%", "icon": "trend", "color": "bg-accent-greenLight text-emerald-600"},
        {"label": "Avg. Engagement Rate", "value": "7.6%", "delta": "+8.2%", "icon": "bar", "color": "bg-accent-purpleLight text-purple-600"},
        {"label": "Total Posts", "value": str(max(56, len(user.contents))), "delta": "+12.4%", "icon": "file", "color": "bg-accent-blueLight text-blue-600"},
    ]

    weekly_analytics = [
        {"day": "Mon", "score": 62},
        {"day": "Tue", "score": 70},
        {"day": "Wed", "score": 68},
        {"day": "Thu", "score": 82},
        {"day": "Fri", "score": 78},
        {"day": "Sat", "score": 88},
        {"day": "Sun", "score": 91},
    ]

    monthly_analytics = [
        {"month": "Jan", "score": 58},
        {"month": "Feb", "score": 63},
        {"month": "Mar", "score": 67},
        {"month": "Apr", "score": 72},
        {"month": "May", "score": 76},
        {"month": "Jun", "score": 81},
    ]

    platform_comparison = [
        {"platform": "Instagram", "engagement": 8200},
        {"platform": "LinkedIn", "engagement": 4600},
        {"platform": "Facebook", "engagement": 3100},
        {"platform": "Twitter (X)", "engagement": 1800},
        {"platform": "YouTube", "engagement": 6300},
    ]

    top_posts = [
        {"id": 1, "title": "New Product Launch Post", "platform": "Instagram", "score": 92, "engagement": "12.4K"},
        {"id": 2, "title": "Behind the Scenes", "platform": "Instagram", "score": 90, "engagement": "9.8K"},
        {"id": 3, "title": "Study Tips Video", "platform": "YouTube", "score": 88, "engagement": "8.1K"},
    ]

    content_type_distribution = [
        {"name": "Image", "value": 45, "color": "#635BFF"},
        {"name": "Carousel", "value": 30, "color": "#8B5CF6"},
        {"name": "Video", "value": 15, "color": "#3B82F6"},
        {"name": "Text", "value": 10, "color": "#C2C4D6"},
    ]

    heatmap_data = {
        "days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "hours": ["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"],
        "values": [
            [10, 15, 40, 60, 55, 70],
            [8, 12, 45, 65, 58, 80],
            [12, 18, 50, 70, 62, 85],
            [15, 20, 55, 75, 68, 90],
            [20, 25, 60, 80, 72, 95],
            [30, 20, 35, 50, 78, 88],
            [25, 15, 30, 45, 60, 72],
        ],
    }

    return {
        "stats": stats,
        "weeklyAnalytics": weekly_analytics,
        "monthlyAnalytics": monthly_analytics,
        "platformComparison": platform_comparison,
        "topPosts": top_posts,
        "contentTypeDistribution": content_type_distribution,
        "heatmapData": heatmap_data
    }
