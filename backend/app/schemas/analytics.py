from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SummaryCard(BaseModel):
    id: int
    label: str
    value: str
    delta: str
    trend: str
    icon: str
    color: str
    spark: List[int]

class EngagementOverviewPoint(BaseModel):
    day: str
    engagement: int
    reach: int

class PlatformPerformanceItem(BaseModel):
    name: str
    value: int
    color: str
    icon: Optional[str] = None
    iconColor: Optional[str] = None

class ScoreDistributionItem(BaseModel):
    name: str
    value: int
    color: str

class AIInsightItem(BaseModel):
    id: int
    text: str
    icon: Optional[str] = None
    bg: Optional[str] = None
    iconColor: Optional[str] = None

class DashboardAnalyticsResponse(BaseModel):
    summaryCards: List[SummaryCard]
    engagementOverview: List[EngagementOverviewPoint]
    platformPerformance: List[PlatformPerformanceItem]
    contentScoreDistribution: List[ScoreDistributionItem]
    aiInsights: List[AIInsightItem]

class OverviewStat(BaseModel):
    label: str
    value: str
    delta: str
    icon: str
    color: str

class WeeklyPoint(BaseModel):
    day: str
    score: int

class MonthlyPoint(BaseModel):
    month: str
    score: int

class PlatformComparisonItem(BaseModel):
    platform: str
    engagement: int

class TopPostItem(BaseModel):
    id: Any
    title: str
    platform: str
    score: int
    engagement: str

class ContentTypeItem(BaseModel):
    name: str
    value: int
    color: str

class HeatmapData(BaseModel):
    days: List[str]
    hours: List[str]
    values: List[List[int]]

class AnalyticsOverviewResponse(BaseModel):
    stats: List[OverviewStat]
    weeklyAnalytics: List[WeeklyPoint]
    monthlyAnalytics: List[MonthlyPoint]
    platformComparison: List[PlatformComparisonItem]
    topPosts: List[TopPostItem]
    contentTypeDistribution: List[ContentTypeItem]
    heatmapData: HeatmapData
