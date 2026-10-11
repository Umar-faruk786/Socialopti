from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class ContentPlanningAgent(BaseAgent):
    """
    Agent 3: Content Planning Agent
    Generates content ideas, hooks, hashtags, and posting strategy tailored to platforms.
    """

    def __init__(self):
        super().__init__(
            name="Content Planning Agent",
            description="Recommends content variations, caption hooks, hashtags, and schedule strategy."
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        caption = context.get("caption", "")
        platforms = context.get("platforms", ["instagram", "linkedin"])
        trend_data = context.get("trend_data", {})
        trending_hashtags = trend_data.get("trending_hashtags", ["#GrowthMindset", "#AITools", "#WorkSmart"])

        # Construct improved caption
        first_line = caption.split("\n")[0] if "\n" in caption else caption[:80]
        if not first_line.endswith((".", "!", "?", "🚀", "✨", "👇")):
            first_line += " ✨"

        improved_caption = f"{first_line}\n\nSwipe through to see the exact breakdown and let me know your thoughts below! 👇"

        # Determine best posting time based on primary platform
        primary_platform = platforms[0] if platforms else "instagram"
        platform_timing = {
            "instagram": {"day": "Today", "time": "8:00 PM", "label": "peak active audience window"},
            "linkedin": {"day": "Tomorrow", "time": "9:30 AM", "label": "optimal B2B morning peak"},
            "twitter": {"day": "Today", "time": "12:00 PM", "label": "lunch break engagement peak"},
            "facebook": {"day": "Today", "time": "1:00 PM", "label": "afternoon community peak"},
            "youtube": {"day": "Saturday", "time": "4:00 PM", "label": "weekend video watch peak"},
            "tiktok": {"day": "Today", "time": "7:30 PM", "label": "prime evening viral window"},
        }
        best_time = platform_timing.get(primary_platform.lower(), {"day": "Today", "time": "8:00 PM", "label": "high engagement time"})

        return {
            "agent": self.name,
            "improved_caption": improved_caption,
            "curated_hashtags": trending_hashtags[:7],
            "best_time": best_time,
            "recommended_format": "Carousel (3-5 slides)" if "linkedin" in platforms or "instagram" in platforms else "Single High-Res Image"
        }
