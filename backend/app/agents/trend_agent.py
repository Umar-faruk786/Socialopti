import re
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class TrendAnalysisAgent(BaseAgent):
    """
    Agent 1: Trend Analysis Agent
    Analyzes current social media trends, identifies trending topics, hashtags and velocity.
    """

    def __init__(self):
        super().__init__(
            name="Trend Analysis Agent",
            description="Analyzes live trends, viral hashtags, and niche topic relevancy."
        )

        # Knowledge base of trending categories & keywords
        self.trend_database = {
            "ai": ["#AIRevolution", "#AITools", "#MachineLearning", "#GenAI", "#FutureOfWork"],
            "tech": ["#TechTrends", "#Innovation", "#TechNews", "#SoftwareEngineering", "#CodeDaily"],
            "productivity": ["#ProductivityHacks", "#WorkSmarter", "#TimeManagement", "#GrowthMindset", "#Efficiency"],
            "design": ["#DesignInspo", "#UIUX", "#Minimalism", "#WorkspaceGoals", "#DeskSetup"],
            "business": ["#StartupLife", "#DigitalMarketing", "#CreatorEconomy", "#SocialMediaGrowth", "#B2BGrowth"],
            "lifestyle": ["#DailyRoutine", "#Focus", "#Motivation", "#Creativity", "#Mindset"]
        }

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        caption = context.get("caption", "").lower()
        existing_tags = context.get("hashtags", [])
        platforms = context.get("platforms", ["instagram", "linkedin"])

        matched_trends: List[str] = []
        recommended_hashtags: List[str] = []

        # Find matching topics from caption
        for category, tags in self.trend_database.items():
            if category in caption or any(tag.lower().replace("#", "") in caption for tag in tags):
                matched_trends.append(category.capitalize())
                recommended_hashtags.extend(tags[:3])

        # If no direct match, add top general tech/productivity trends
        if not recommended_hashtags:
            matched_trends = ["Tech & AI", "Productivity"]
            recommended_hashtags = ["#AIRevolution", "#ProductivityHacks", "#TechTrends", "#CreatorEconomy"]

        # Deduplicate hashtags
        unique_hashtags = list(dict.fromkeys(existing_tags + recommended_hashtags))

        trend_velocity_score = min(98, 70 + len(matched_trends) * 8 + len(unique_hashtags))

        return {
            "agent": self.name,
            "matched_trends": matched_trends,
            "trending_hashtags": unique_hashtags[:8],
            "trend_velocity_score": trend_velocity_score,
            "niche_relevance": "High" if trend_velocity_score >= 80 else "Moderate"
        }
