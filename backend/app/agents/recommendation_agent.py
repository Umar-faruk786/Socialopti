import os
import json
import logging
from typing import Dict, Any, List, Optional
from app.agents.base_agent import BaseAgent
from app.config import settings

logger = logging.getLogger(__name__)

# Attempt to import google-genai SDK
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


class RecommendationAgent(BaseAgent):
    """
    Agent 5: Recommendation Agent
    Synthesizes multi-agent outputs to generate genuinely post-specific improved captions,
    niche hashtags, optimal posting schedules, audience demographics, and actionable tips using Gemini AI.
    """

    def __init__(self):
        super().__init__(
            name="Recommendation Agent",
            description="Generates tailored improved captions, strategic hashtags, best posting times, and action tips."
        )
        self.client = None
        self._init_gemini_client()

    def _init_gemini_client(self):
        """Initializes Google GenAI client if credentials exist."""
        if not GENAI_AVAILABLE:
            return

        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception as e:
                logger.warning(f"RecommendationAgent: Failed to initialize Google GenAI Client: {e}")
                self.client = None

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        caption = context.get("caption", "").strip()
        planning_data = context.get("planning_data", {})
        content_analysis = context.get("content_analysis", {})
        trend_data = context.get("trend_data", {})
        platforms = context.get("platforms", ["instagram", "linkedin"])
        goal = context.get("goal", "engagement")
        hashtags = context.get("hashtags", [])
        media_type = context.get("media_type", "image/jpeg")

        if self.client is None:
            self._init_gemini_client()

        # Attempt Gemini generation
        if self.client:
            gemini_result = await self._generate_with_gemini(
                caption=caption,
                platforms=platforms,
                goal=goal,
                media_type=media_type,
                content_analysis=content_analysis,
                trend_data=trend_data,
                hashtags=hashtags
            )
            if gemini_result:
                return gemini_result

        # Dynamic fallback if Gemini is unavailable
        return self._dynamic_fallback(
            caption=caption,
            platforms=platforms,
            goal=goal,
            media_type=media_type,
            content_analysis=content_analysis,
            trend_data=trend_data,
            hashtags=hashtags,
            planning_data=planning_data
        )

    async def _generate_with_gemini(
        self,
        caption: str,
        platforms: List[str],
        goal: str,
        media_type: str,
        content_analysis: Dict[str, Any],
        trend_data: Dict[str, Any],
        hashtags: List[str]
    ) -> Optional[Dict[str, Any]]:
        """Invokes Gemini to generate genuinely post-specific recommendations."""
        primary_platform = platforms[0] if platforms else "instagram"
        top_kws = content_analysis.get("top_keywords", [])
        detected_tone = content_analysis.get("tone", "Engaging")
        suggestions = content_analysis.get("suggestions", [])

        prompt = (
            "You are an expert social media copywriter and growth strategist for SocialOpti.\n"
            "Generate genuinely post-specific content recommendations to optimize this exact post.\n"
            "Do NOT return generic placeholder text or unrelated topics.\n\n"
            "Post Context:\n"
            f"- Original Caption: {caption if caption else '[Visual-only post without caption]'}\n"
            f"- Target Platforms: {platforms}\n"
            f"- Campaign Goal: {goal}\n"
            f"- Media Type: {media_type}\n"
            f"- Detected Tone: {detected_tone}\n"
            f"- Extracted Keywords: {top_kws}\n"
            f"- Analysis Suggestions: {suggestions}\n"
            f"- User Hashtags: {hashtags}\n\n"
            "Requirements:\n"
            "1. improved_caption (str): A compelling, platform-optimized rewrite of the caption that refines the opening hook, readability, storytelling, line-breaks, and a clear call-to-action aligned with the goal.\n"
            "2. hashtags (list of 5 to 7 strings): High-performing, niche-specific hashtags (starting with #) strictly tailored to this post's topic.\n"
            f"3. best_time (object with 'day', 'time', 'label'): The single best day and time to publish on {primary_platform} with a concise rationale.\n"
            "4. audience (object with 'ageRange', 'interests', 'regions'): Realistic target audience profile relevant to this post's specific niche and platforms.\n"
            "5. improvement_tips (list of exactly 3 objects, each with 'title' and 'desc'): Three concrete, highly specific recommendations addressing the weaknesses identified in the content analysis (e.g. hook opening, visual clarity, conversion CTA).\n\n"
            "Return ONLY valid JSON matching this schema:\n"
            "{\n"
            '  "improved_caption": str,\n'
            '  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],\n'
            '  "best_time": {"day": "Today", "time": "8:00 PM", "label": "peak engagement window"},\n'
            '  "audience": {"ageRange": "22–34", "interests": ["Topic1", "Topic2"], "regions": ["India", "USA", "UAE"]},\n'
            '  "improvement_tips": [\n'
            '    {"title": "Title 1", "desc": "Specific tip 1"},\n'
            '    {"title": "Title 2", "desc": "Specific tip 2"},\n'
            '    {"title": "Title 3", "desc": "Specific tip 3"}\n'
            '  ]\n'
            "}"
        )

        models_to_try = [settings.GEMINI_MODEL, settings.GEMINI_FALLBACK_MODEL, "gemini-3.8-flash"]
        models_to_try = list(dict.fromkeys([m for m in models_to_try if m]))

        raw_text = None
        for model_name in models_to_try:
            try:
                logger.info(f"RecommendationAgent: Calling Gemini model '{model_name}'...")
                res = self.client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.3
                    )
                )
                if res and res.text:
                    raw_text = res.text
                    logger.info(f"RecommendationAgent: Gemini recommendations succeeded using '{model_name}'.")
                    break
            except Exception as e:
                err_str = str(e)
                if "503" in err_str or "UNAVAILABLE" in err_str:
                    logger.warning(f"RecommendationAgent: Model '{model_name}' temporarily busy (503). Trying fallback model...")
                else:
                    logger.warning(f"RecommendationAgent: Gemini call to '{model_name}' failed ({type(e).__name__}).")

        if not raw_text:
            logger.warning("RecommendationAgent: No response from Gemini models. Triggering dynamic fallback.")
            return None

        try:
            data = json.loads(raw_text.strip())

            # Validate improved_caption
            improved_caption = str(data.get("improved_caption") or "").strip()
            if not improved_caption:
                return None

            # Validate hashtags
            raw_tags = data.get("hashtags", [])
            hashtags_list = [f"#{t.lstrip('#').strip()}" for t in raw_tags if str(t).strip()][:7]
            if not hashtags_list:
                hashtags_list = [f"#{k.capitalize()}" for k in top_kws[:4]] or ["#Trending", "#ContentStrategy"]

            # Validate best_time
            bt = data.get("best_time") or {}
            best_time = {
                "day": str(bt.get("day") or "Today").strip(),
                "time": str(bt.get("time") or "8:00 PM").strip(),
                "label": str(bt.get("label") or "optimal audience window").strip()
            }

            # Validate audience
            aud = data.get("audience") or {}
            audience = {
                "ageRange": str(aud.get("ageRange") or "22–34").strip(),
                "interests": [str(i).strip() for i in aud.get("interests", []) if str(i).strip()][:4] or ["General Interest"],
                "regions": [str(r).strip() for r in aud.get("regions", []) if str(r).strip()][:4] or ["Global"]
            }

            # Validate improvement_tips
            raw_tips = data.get("improvement_tips", [])
            improvement_tips = []
            for tip in raw_tips:
                if isinstance(tip, dict) and tip.get("title") and tip.get("desc"):
                    improvement_tips.append({
                        "title": str(tip["title"]).strip(),
                        "desc": str(tip["desc"]).strip()
                    })

            if len(improvement_tips) < 3:
                # Fill missing tips with actionable fallbacks based on suggestions
                for s in suggestions:
                    if len(improvement_tips) >= 3:
                        break
                    improvement_tips.append({
                        "title": "Actionable Optimization",
                        "desc": str(s).strip()
                    })
                while len(improvement_tips) < 3:
                    improvement_tips.append({
                        "title": "Audience Targeting",
                        "desc": f"Publish during peak {best_time['time']} window on {primary_platform.capitalize()} to maximize reach."
                    })

            return {
                "agent": self.name,
                "improved_caption": improved_caption,
                "hashtags": hashtags_list,
                "best_time": best_time,
                "audience": audience,
                "improvement_tips": improvement_tips[:3]
            }
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            logger.warning(f"RecommendationAgent: Failed to parse Gemini response: {e}")
            return None

    def _dynamic_fallback(
        self,
        caption: str,
        platforms: List[str],
        goal: str,
        media_type: str,
        content_analysis: Dict[str, Any],
        trend_data: Dict[str, Any],
        hashtags: List[str],
        planning_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Dynamically constructs tailored recommendations based on actual input context
        when Gemini API is unreachable or rate-limited.
        """
        logger.info("RecommendationAgent: Executing dynamic heuristic recommendation fallback.")
        primary_platform = platforms[0].lower() if platforms else "instagram"
        top_kws = content_analysis.get("top_keywords", [])
        topic = " ".join([k.capitalize() for k in top_kws[:2]]) if top_kws else "this update"

        # Dynamically build improved caption based on goal and primary platform
        lines = [line.strip() for line in caption.split("\n") if line.strip()]
        first_line = lines[0] if lines else f"Excited to share insights on {topic}!"
        
        # Clean first line hook
        hook = first_line.rstrip(".!?")
        if not any(hook.endswith(emoji) for emoji in ["✨", "🚀", "💡", "🔥"]):
            hook += " 🚀"

        if goal == "leads":
            cta = "Drop a comment below or send a DM to get the full step-by-step framework! 👇"
        elif goal == "reach":
            cta = "Tag someone who needs to see this, and save for your next project! 📌"
        else:
            cta = "What are your thoughts on this? Let me know in the comments below! 👇"

        if len(lines) > 1:
            body = "\n\n".join(lines[1:3])
            improved_caption = f"{hook}\n\n{body}\n\n{cta}"
        else:
            improved_caption = f"{hook}\n\nHere is what you need to know about {topic.lower()} to stay ahead in your workflow.\n\n{cta}"

        # Context-derived hashtags
        derived_tags = [f"#{k.replace(' ', '').capitalize()}" for k in top_kws]
        curated_tags = list(dict.fromkeys(hashtags + derived_tags + [f"#{primary_platform.capitalize()}Growth"]))[:7]
        if not curated_tags:
            curated_tags = ["#ContentStrategy", "#GrowthHacks", "#DigitalMarketing"]

        # Platform-specific best times
        timing_map = {
            "instagram": {"day": "Today", "time": "7:30 PM", "label": "peak active audience window"},
            "linkedin": {"day": "Tomorrow", "time": "8:45 AM", "label": "optimal B2B morning peak"},
            "twitter": {"day": "Today", "time": "12:15 PM", "label": "lunch break engagement peak"},
            "facebook": {"day": "Today", "time": "1:30 PM", "label": "afternoon community peak"},
            "youtube": {"day": "Saturday", "time": "3:00 PM", "label": "weekend video watch peak"},
            "tiktok": {"day": "Today", "time": "8:00 PM", "label": "prime evening viral window"},
        }
        best_time = timing_map.get(primary_platform, {"day": "Today", "time": "7:00 PM", "label": "peak engagement time"})

        # Niche audience
        interests = [k.capitalize() for k in top_kws[:3]] if top_kws else ["Content Creation", "Social Strategy"]
        audience = {
            "ageRange": "24–36" if primary_platform in ["linkedin", "twitter"] else "18–30",
            "interests": interests,
            "regions": ["United States", "India", "United Kingdom"]
        }

        # Dynamic improvement tips reflecting content analysis feedback
        suggestions = content_analysis.get("suggestions", [])
        image_qual = content_analysis.get("image_quality", 0)

        tip1_desc = suggestions[0] if len(suggestions) > 0 else f"Enhance your hook in the first line to maximize dwell time on {primary_platform.capitalize()}."
        tip2_desc = suggestions[1] if len(suggestions) > 1 else f"Incorporate 3–5 targeted niche hashtags related to {topic}."
        if image_qual > 0 and image_qual < 85:
            tip3_desc = "Optimize contrast and visual clarity for mobile feed scroll-stop."
        else:
            tip3_desc = f"Publish during the recommended {best_time['time']} window to capture active followers."

        improvement_tips = [
            {"title": "Hook & Caption Optimization", "desc": tip1_desc},
            {"title": "Discovery & Keywords", "desc": tip2_desc},
            {"title": "Audience Timing", "desc": tip3_desc}
        ]

        return {
            "agent": self.name,
            "improved_caption": improved_caption,
            "hashtags": curated_tags,
            "best_time": best_time,
            "audience": audience,
            "improvement_tips": improvement_tips
        }
