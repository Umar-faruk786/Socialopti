import logging
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)


def _format_metric_range(low: int, high: int) -> str:
    """Formats an integer range into readable social metric notation (e.g. 850 – 1.4K)."""
    def fmt(val: int) -> str:
        if val >= 1000:
            return f"{(val / 1000):.1f}K".replace(".0K", "K")
        return str(val)
    return f"{fmt(low)} – {fmt(high)}"


class EngagementPredictionAgent(BaseAgent):
    """
    Agent 4: Engagement Prediction Agent
    Computes responsive, input-calibrated heuristic estimates for multi-platform performance,
    reach probability, virality potential, and expected interactions.
    Explicitly operates as an empirical heuristic model rather than measuring real telemetry.
    """

    def __init__(self):
        super().__init__(
            name="Engagement Prediction Agent",
            description="Computes calibrated heuristic performance estimates and cross-platform forecasts."
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        content_analysis = context.get("content_analysis", {})
        trend_data = context.get("trend_data", {})
        selected_platforms = [p.lower() for p in context.get("platforms", ["instagram"])]
        goal = str(context.get("goal") or "engagement").lower()
        media_type = str(context.get("media_type") or "image/jpeg").lower()
        is_video = "video" in media_type
        caption = context.get("caption", "")
        post_history = context.get("post_history", [])

        # 1. Base Score Calibration
        content_score = content_analysis.get("overall_score", 78)
        caption_quality = content_analysis.get("caption_quality", 75)
        trend_velocity = trend_data.get("trend_velocity_score", 70)
        tone = content_analysis.get("tone", "Professional").lower()

        # Account History Factor (if available)
        has_history = len(post_history) > 0
        if has_history:
            avg_past_score = sum(p.get("engagement_score", 75) for p in post_history) / len(post_history)
            # Calibrate current post relative to past account performance
            calibrated_score = int((content_score * 0.55) + (trend_velocity * 0.25) + (avg_past_score * 0.20))
            estimation_basis = "Historical account baseline + multi-agent benchmark"
            logger.info("PredictionAgent: Calibrated estimates using %d historical posts.", len(post_history))
        else:
            calibrated_score = int((content_score * 0.65) + (trend_velocity * 0.35))
            estimation_basis = "Calibrated social media copywriting heuristic benchmarks"

        # Goal adjustments
        if goal == "reach":
            calibrated_score = min(98, calibrated_score + 3)
        elif goal == "leads":
            calibrated_score = max(45, calibrated_score - 2)

        total_engagement_score = min(98, max(45, calibrated_score))

        # 2. Probability Gauges
        if is_video:
            reach_prob = min(96, max(50, int(total_engagement_score * 0.98)))
            virality_prob = min(94, max(40, int(total_engagement_score * 0.88)))
        else:
            reach_prob = min(95, max(40, int(total_engagement_score * 0.90)))
            virality_prob = min(90, max(30, int(total_engagement_score * 0.78)))

        engagement_prob = total_engagement_score

        # 3. Dynamic Platform Breakdown
        platform_definitions = [
            {"name": "Instagram", "icon": "instagram", "color": "#EC4899"},
            {"name": "LinkedIn", "icon": "linkedin", "color": "#3B82F6"},
            {"name": "Facebook", "icon": "facebook", "color": "#4F65D6"},
            {"name": "Twitter (X)", "icon": "twitter", "color": "#111827"},
            {"name": "YouTube", "icon": "youtube", "color": "#EF4444"},
        ]

        platform_breakdown = []
        for p in platform_definitions:
            p_key = p["name"].lower()
            is_selected = any(p_key.startswith(sp[:4]) for sp in selected_platforms)

            # Contextual platform affinity modifiers
            suitability_mod = 0
            if "linkedin" in p_key:
                if any(w in tone for w in ["professional", "authoritative", "informative"]):
                    suitability_mod += 8
                if is_video:
                    suitability_mod -= 4
            elif "instagram" in p_key:
                if not is_video and content_analysis.get("image_quality", 0) >= 80:
                    suitability_mod += 6
                if "casual" in tone or "engaging" in tone:
                    suitability_mod += 5
            elif "youtube" in p_key:
                if is_video:
                    suitability_mod += 14
                else:
                    suitability_mod -= 12
            elif "twitter" in p_key:
                if len(caption) < 280:
                    suitability_mod += 4

            # Explicit target bonus
            user_target_bonus = 5 if is_selected else -4

            platform_score = min(98, max(38, total_engagement_score + suitability_mod + user_target_bonus))
            label = "Excellent" if platform_score >= 85 else "Very Good" if platform_score >= 75 else "Good" if platform_score >= 65 else "Moderate"

            platform_breakdown.append({
                "platform": p["name"],
                "icon": p["icon"],
                "score": platform_score,
                "label": label,
                "color": p["color"]
            })

        # 4. Input-Dependent Numerical Range Estimation
        # Computes dynamic scaled interaction volumes rather than static 3-level buckets
        scale_factor = (total_engagement_score / 100.0) ** 2.4
        base_impressions = int(1800 + scale_factor * 12000)

        if is_video:
            base_impressions = int(base_impressions * 1.8)

        low_reach = max(800, int(base_impressions * 0.8))
        high_reach = max(1400, int(base_impressions * 1.35))

        # Goal-weighted interaction rates
        if goal == "engagement":
            like_rate_low, like_rate_high = 0.07, 0.12
            comment_rate_low, comment_rate_high = 0.012, 0.022
            share_rate_low, share_rate_high = 0.006, 0.014
        elif goal == "leads":
            like_rate_low, like_rate_high = 0.04, 0.07
            comment_rate_low, comment_rate_high = 0.008, 0.016
            share_rate_low, share_rate_high = 0.009, 0.018  # higher save/share
        else:  # reach / brand awareness
            like_rate_low, like_rate_high = 0.05, 0.09
            comment_rate_low, comment_rate_high = 0.006, 0.012
            share_rate_low, share_rate_high = 0.008, 0.016

        low_likes = max(25, int(low_reach * like_rate_low))
        high_likes = max(60, int(high_reach * like_rate_high))

        low_comments = max(4, int(low_reach * comment_rate_low))
        high_comments = max(12, int(high_reach * comment_rate_high))

        low_shares = max(2, int(low_reach * share_rate_low))
        high_shares = max(8, int(high_reach * share_rate_high))

        expected_engagement = {
            "likes": _format_metric_range(low_likes, high_likes),
            "comments": _format_metric_range(low_comments, high_comments),
            "shares": _format_metric_range(low_shares, high_shares),
            "reach": _format_metric_range(low_reach, high_reach)
        }

        return {
            "agent": self.name,
            "total_engagement_score": total_engagement_score,
            "reach_probability": reach_prob,
            "virality_probability": virality_prob,
            "engagement_probability": engagement_prob,
            "expected_engagement": expected_engagement,
            "platform_breakdown": platform_breakdown,
            "estimation_metadata": {
                "is_heuristic_estimate": True,
                "estimation_basis": estimation_basis,
                "has_historical_calibration": has_history
            }
        }
