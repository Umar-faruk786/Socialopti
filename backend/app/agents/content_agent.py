import os
import re
import json
import logging
from typing import Dict, Any, List, Optional, Tuple
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
    logger.warning("google-genai package not found. ContentAnalysisAgent will use fallback heuristics.")


def _resolve_image_part(media_url: Optional[str], media_type: Optional[str]) -> Tuple[Optional[Any], str]:
    """
    Safely resolves uploaded image data and returns a Gemini types.Part object.
    If the file is missing, is a video, or is unsupported, returns (None, reason).
    """
    if not media_url:
        return None, "no_media_url"

    # Explicitly check for video types
    if media_type and media_type.lower().startswith("video/"):
        return None, "video_skipped"
    if any(media_url.lower().endswith(ext) for ext in [".mp4", ".mov", ".avi", ".webm", ".mkv"]):
        return None, "video_skipped"

    if not GENAI_AVAILABLE:
        return None, "genai_unavailable"

    # Check local candidate paths
    upload_dir = os.path.abspath(settings.UPLOAD_DIR)
    filename = os.path.basename(media_url)

    candidate_paths = [
        media_url,
        os.path.join(upload_dir, filename),
        os.path.join(settings.UPLOAD_DIR, filename),
        os.path.join("backend", settings.UPLOAD_DIR, filename)
    ]

    if media_url.startswith("/static/uploads/"):
        rel_filename = media_url.split("/static/uploads/")[-1]
        candidate_paths.insert(0, os.path.join(upload_dir, rel_filename))
        candidate_paths.insert(1, os.path.join(settings.UPLOAD_DIR, rel_filename))

    resolved_path = None
    for path in candidate_paths:
        if path and os.path.isfile(path):
            resolved_path = path
            break

    # If local file exists, read bytes and package Part
    if resolved_path:
        try:
            file_size = os.path.getsize(resolved_path)
            max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
            if 0 < file_size <= max_size_bytes:
                ext = os.path.splitext(resolved_path)[1].lower()
                mime_map = {
                    ".jpg": "image/jpeg",
                    ".jpeg": "image/jpeg",
                    ".png": "image/png",
                    ".webp": "image/webp",
                    ".gif": "image/gif"
                }
                detected_mime = mime_map.get(ext, media_type or "image/jpeg")
                with open(resolved_path, "rb") as f:
                    image_bytes = f.read()
                return types.Part.from_bytes(data=image_bytes, mime_type=detected_mime), "local_image_loaded"
        except Exception as e:
            logger.warning(f"Failed reading local image file {resolved_path}: {e}")
            return None, "read_error"

    # If remote HTTP image URL, attempt lightweight fetch
    if media_url.startswith(("http://", "https://")):
        try:
            import httpx
            with httpx.Client(timeout=4.0) as http_client:
                resp = http_client.get(media_url)
                content_type = resp.headers.get("content-type", "").lower()
                if resp.status_code == 200 and content_type.startswith("image/"):
                    mime = content_type.split(";")[0].strip()
                    return types.Part.from_bytes(data=resp.content, mime_type=mime), "remote_image_loaded"
        except Exception as e:
            logger.warning(f"Could not fetch remote media URL: {e}")
            return None, "remote_fetch_failed"

    return None, "media_not_found"


class ContentAnalysisAgent(BaseAgent):
    """
    Agent 2: Content Analysis Agent
    Evaluates caption quality, grammar, readability, sentiment, tone, and visual content using Google Gemini.
    """

    def __init__(self):
        super().__init__(
            name="Content Analysis Agent",
            description="Evaluates image/caption quality, grammar, readability, sentiment, and tone using Gemini AI."
        )
        self.client = None
        self._init_gemini_client()

    def _init_gemini_client(self):
        """Initializes the Google GenAI client if credentials are configured."""
        if not GENAI_AVAILABLE:
            return

        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize Google GenAI Client: {e}")
                self.client = None

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        caption = context.get("caption", "").strip()
        media_type = context.get("media_type", "image/jpeg")
        media_url = context.get("media_url")
        platforms = context.get("platforms", ["instagram", "linkedin"])
        hashtags = context.get("hashtags", [])
        goal = context.get("goal", "engagement")

        # Re-check client in case environment variables were populated dynamically
        if self.client is None:
            self._init_gemini_client()

        # Resolve image data if available
        image_part, media_status = _resolve_image_part(media_url, media_type)
        has_image = image_part is not None

        # Attempt Gemini analysis
        if self.client:
            analysis_result = await self._analyze_with_gemini(
                caption=caption,
                platforms=platforms,
                hashtags=hashtags,
                goal=goal,
                image_part=image_part,
                media_status=media_status
            )
            if analysis_result:
                return analysis_result

        # Graceful fallback if Gemini is unreachable or unconfigured
        return self._fallback_analysis(caption, hashtags, has_image, media_status)

    async def _analyze_with_gemini(
        self,
        caption: str,
        platforms: List[str],
        hashtags: List[str],
        goal: str,
        image_part: Optional[Any],
        media_status: str
    ) -> Optional[Dict[str, Any]]:
        """Invokes Gemini with structured JSON output and validates response."""
        has_image = image_part is not None

        prompt = (
            "You are an expert social media content evaluator for SocialOpti.\n"
            "Evaluate the following social media post objectively based on copywriting and content performance best practices.\n"
            "These scores represent estimated heuristic quality ratings (0-100 scale), NOT guaranteed real-world metrics.\n\n"
            f"Post Details:\n"
            f"- Caption: {caption if caption else '[No caption provided]'}\n"
            f"- Targeted Platforms: {platforms}\n"
            f"- User Hashtags: {hashtags}\n"
            f"- Campaign Goal: {goal}\n"
            f"- Visual Asset: {'Attached image for visual analysis' if has_image else f'No image provided ({media_status})'}\n\n"
            "Evaluation Criteria:\n"
            "1. caption_quality (int, 0-100): Strength of hook, clarity, structure, storytelling, and call-to-action.\n"
            "2. readability (int, 0-100): Ease of reading, line breaks, formatting, and mobile scanability.\n"
            "3. grammar (int, 0-100): Grammatical correctness, punctuation, spelling, and sentence flow.\n"
            "4. image_quality (int, 0-100): If image is attached, evaluate visual clarity, framing, lighting, contrast, and stopping power. If no image is attached, return 0.\n"
            "5. emotion_detected (str): Dominant emotion conveyed (e.g., 'Positive', 'Inspirational', 'Urgent', 'Empathetic', 'Curious', 'Humorous', 'Informative').\n"
            "6. emotion_confidence (int, 0-100): Estimated confidence percentage in the detected emotion.\n"
            "7. tone (str): Primary communication tone (e.g., 'Professional', 'Casual & Friendly', 'Authoritative', 'Engaging & Conversational', 'Bold & Direct').\n"
            "8. tone_confidence (int, 0-100): Estimated confidence percentage in the detected tone.\n"
            "9. hashtag_quality (str): 'Excellent' (5-10 strategic tags), 'Good' (2-4 relevant tags), or 'Needs Improvement' (0-1 tags or generic).\n"
            "10. top_keywords (list of 3 to 5 lowercase strings): Main keywords or semantic themes.\n"
            "11. suggestions (list of 3 strings): Actionable, constructive recommendations to improve caption engagement, readability, hook, CTA, or imagery.\n\n"
            "Return ONLY a valid JSON object matching this schema:\n"
            "{\n"
            '  "caption_quality": int,\n'
            '  "readability": int,\n'
            '  "grammar": int,\n'
            '  "image_quality": int,\n'
            '  "emotion_detected": str,\n'
            '  "emotion_confidence": int,\n'
            '  "tone": str,\n'
            '  "tone_confidence": int,\n'
            '  "hashtag_quality": str,\n'
            '  "top_keywords": ["keyword1", "keyword2", "keyword3"],\n'
            '  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]\n'
            "}"
        )

        contents = [image_part, prompt] if has_image else prompt

        # Support model configuration with fallback for transient high-demand (503) spikes
        models_to_try = [settings.GEMINI_MODEL, settings.GEMINI_FALLBACK_MODEL, "gemini-3.8-flash"]
        # Deduplicate while preserving order
        models_to_try = list(dict.fromkeys([m for m in models_to_try if m]))

        raw_text = None
        for model_name in models_to_try:
            try:
                logger.info(f"ContentAnalysisAgent: Calling Gemini model '{model_name}' (multimodal={has_image})...")
                res = self.client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.2
                    )
                )
                if res and res.text:
                    raw_text = res.text
                    logger.info(f"ContentAnalysisAgent: Gemini analysis succeeded using model '{model_name}'.")
                    break
            except Exception as e:
                err_str = str(e)
                # Never log secrets; log only safe error diagnosis
                if "503" in err_str or "UNAVAILABLE" in err_str:
                    logger.warning(f"ContentAnalysisAgent: Model '{model_name}' temporarily busy (503). Trying fallback model...")
                else:
                    logger.warning(f"ContentAnalysisAgent: Gemini call to '{model_name}' failed ({type(e).__name__}).")

        if not raw_text:
            logger.warning("ContentAnalysisAgent: No response from Gemini models. Triggering heuristic fallback.")
            return None

        # Parse and validate structured output
        try:
            data = json.loads(raw_text.strip())

            # Validate and clamp numeric fields (0-100)
            def clamp_score(val, default=80):
                try:
                    return max(0, min(100, int(val)))
                except (ValueError, TypeError):
                    return default

            caption_quality = clamp_score(data.get("caption_quality"), 80)
            readability = clamp_score(data.get("readability"), 80)
            grammar = clamp_score(data.get("grammar"), 85)
            
            # If no image was provided, ensure image_quality reflects absence without pretending analysis occurred
            if has_image:
                image_quality = clamp_score(data.get("image_quality"), 85)
                overall_score = int((image_quality * 0.35) + (caption_quality * 0.35) + (readability * 0.15) + (grammar * 0.15))
            else:
                image_quality = 0
                overall_score = int((caption_quality * 0.50) + (readability * 0.25) + (grammar * 0.25))

            overall_score = clamp_score(overall_score, 80)
            emotion_confidence = clamp_score(data.get("emotion_confidence"), 80)
            tone_confidence = clamp_score(data.get("tone_confidence"), 85)

            emotion_detected = str(data.get("emotion_detected") or "Positive").strip()
            tone = str(data.get("tone") or "Professional").strip()
            hashtag_quality = str(data.get("hashtag_quality") or ("Excellent" if len(hashtags) >= 5 else "Good")).strip()

            raw_keywords = data.get("top_keywords", [])
            top_keywords = [str(k).lower().strip() for k in raw_keywords if str(k).strip()][:5]
            if not top_keywords:
                top_keywords = ["content", "engagement", "social", "growth", "strategy"]

            raw_suggestions = data.get("suggestions", [])
            suggestions = [str(s).strip() for s in raw_suggestions if str(s).strip()][:3]
            if len(suggestions) < 3:
                suggestions.append("Incorporate 2–4 targeted hashtags to increase organic discoverability.")

            return {
                "agent": self.name,
                "overall_score": overall_score,
                "image_quality": image_quality,
                "caption_quality": caption_quality,
                "readability": readability,
                "grammar": grammar,
                "emotion_detected": emotion_detected,
                "emotion_confidence": emotion_confidence,
                "tone": tone,
                "tone_confidence": tone_confidence,
                "hashtag_count": len(hashtags),
                "hashtag_quality": hashtag_quality,
                "top_keywords": top_keywords,
                "suggestions": suggestions[:3]
            }
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            logger.warning(f"Failed to parse or validate Gemini output: {e}")
            return None

    def _fallback_analysis(
        self,
        caption: str,
        hashtags: List[str],
        has_image: bool,
        media_status: str
    ) -> Dict[str, Any]:
        """
        Calibrated rule-based fallback when Gemini API is unavailable or unconfigured.
        Clearly provides heuristic baseline estimates.
        """
        logger.info("ContentAnalysisAgent: Executing calibrated heuristic fallback analysis.")
        words = re.findall(r'\b\w+\b', caption)
        word_count = len(words)
        has_cta = any(p in caption.lower() for p in ["comment", "swipe", "share", "link", "tell us", "👇", "🚀", "✨"])
        has_emojis = bool(re.search(r'[\U00010000-\U0010ffff]', caption))

        caption_quality = 70
        if 20 <= word_count <= 120:
            caption_quality += 15
        elif word_count > 10:
            caption_quality += 8
        if has_cta:
            caption_quality += 8
        if has_emojis:
            caption_quality += 5
        caption_quality = min(98, max(50, caption_quality))

        readability = 85 if word_count > 0 else 70
        grammar = 88

        if has_image:
            image_quality = 85
            overall_score = int((image_quality * 0.35) + (caption_quality * 0.35) + (readability * 0.15) + (grammar * 0.15))
        else:
            image_quality = 0
            overall_score = int((caption_quality * 0.50) + (readability * 0.25) + (grammar * 0.25))

        # Basic sentiment/tone detection
        text_lower = caption.lower()
        if any(w in text_lower for w in ["transform", "excited", "great", "launch", "breakthrough", "✨", "🚀"]):
            emotion_detected = "Positive / Excited"
            emotion_confidence = 78
        elif any(w in text_lower for w in ["stop", "warning", "now", "critical", "urgent"]):
            emotion_detected = "Urgent / Direct"
            emotion_confidence = 75
        else:
            emotion_detected = "Inspirational"
            emotion_confidence = 72

        if any(w in text_lower for w in ["strategy", "workflow", "b2b", "framework", "metric", "enterprise"]):
            tone = "Professional"
            tone_confidence = 82
        elif any(w in text_lower for w in ["coffee", "vibe", "cool", "fun", "friends"]):
            tone = "Casual & Friendly"
            tone_confidence = 80
        else:
            tone = "Engaging & Informative"
            tone_confidence = 80

        # Keywords extraction
        stop_words = {"the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of", "with", "is", "are", "this", "that", "we", "you", "our"}
        keywords = [w.lower() for w in words if len(w) > 3 and w.lower() not in stop_words]
        top_keywords = list(dict.fromkeys(keywords))[:5]
        if not top_keywords:
            top_keywords = ["social", "growth", "engagement", "content", "strategy"]

        # Actionable suggestions
        suggestions = []
        if not has_cta:
            suggestions.append("Add a direct call-to-action question at the end to prompt responses.")
        if len(hashtags) < 4:
            suggestions.append("Add 3–5 targeted niche hashtags to increase reach.")
        if not has_image:
            suggestions.append("Attach an eye-catching visual or carousel to maximize feed dwell time.")
        else:
            suggestions.append("Ensure strong lighting and high contrast for optimal mobile feed visibility.")

        return {
            "agent": self.name,
            "overall_score": overall_score,
            "image_quality": image_quality,
            "caption_quality": caption_quality,
            "readability": readability,
            "grammar": grammar,
            "emotion_detected": emotion_detected,
            "emotion_confidence": emotion_confidence,
            "tone": tone,
            "tone_confidence": tone_confidence,
            "hashtag_count": len(hashtags),
            "hashtag_quality": "Excellent" if len(hashtags) >= 5 else "Good",
            "top_keywords": top_keywords,
            "suggestions": suggestions[:3]
        }
