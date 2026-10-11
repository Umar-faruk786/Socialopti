import os
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from app.config import settings
from app.schemas.assistant import AssistantMessage, AssistantChatResponse

logger = logging.getLogger(__name__)

# Attempt to import google-genai SDK
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


SYSTEM_INSTRUCTION = """You are SocialOpti AI, an expert social media growth assistant and content strategist inside the SocialOpti platform.
Your mission is to help creators, founders, and marketers maximize their reach, engagement, virality, and conversion across platforms (Instagram, LinkedIn, X/Twitter, YouTube, Facebook, and TikTok).

When answering:
1. Be structured, concise, and highly actionable.
2. When asked for captions or hooks, provide specific, high-converting copy with clear reasons why it works.
3. Use clean markdown formatting (bold headers, bullet points, numbered lists).
4. Adapt to the specific platform selected (e.g., LinkedIn needs professional hooks and storytelling; Instagram requires strong visual context and swipeable carousels; X requires concise punchy threads).
5. Suggest relevant hashtags or metrics when appropriate.
6. Maintain an encouraging, professional, and knowledgeable tone.
"""

DEFAULT_SUGGESTIONS = [
    "Give me 3 viral hooks for my next post",
    "How do I improve my Instagram carousel engagement?",
    "What are the best times to post this week?",
    "Write a high-converting LinkedIn caption about AI tools",
    "Suggest a 7-day content strategy for beginners"
]


class AssistantService:
    def __init__(self):
        self.client = None
        self._init_client()

    def _init_client(self):
        """Initializes the Google GenAI client if API key is configured."""
        if not GENAI_AVAILABLE:
            logger.warning("AssistantService: google-genai SDK not available.")
            return

        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                self.client = genai.Client(api_key=api_key)
                logger.info("AssistantService: Google GenAI client successfully initialized.")
            except Exception as e:
                logger.warning(f"AssistantService: Failed to initialize GenAI client: {e}")
                self.client = None

    def _build_prompt(
        self,
        message: str,
        history: Optional[List[AssistantMessage]] = None,
        platform: Optional[str] = "all",
        context: Optional[Dict[str, Any]] = None,
        user_name: Optional[str] = None
    ) -> str:
        """Constructs a context-rich prompt for Gemini."""
        prompt_parts = [SYSTEM_INSTRUCTION]

        if user_name:
            prompt_parts.append(f"\nUser context: The creator's name is {user_name}.")

        if platform and platform.lower() != "all":
            prompt_parts.append(f"\nTarget Platform Focus: {platform.capitalize()}.")

        if context:
            prompt_parts.append(f"\nAdditional Context: {context}")

        if history:
            prompt_parts.append("\nRecent Conversation History:")
            # Keep last 6 messages to stay focused and fast
            for h in history[-6:]:
                role_label = "Creator" if h.role == "user" else "SocialOpti AI"
                prompt_parts.append(f"{role_label}: {h.content}")

        prompt_parts.append(f"\nCreator: {message}")
        prompt_parts.append("\nSocialOpti AI:")
        return "\n".join(prompt_parts)
    def _generate_smart_suggestions(self, platform: Optional[str]) -> List[str]:
        p = (platform or "").lower()
        if "linkedin" in p:
            return [
                "Give me 3 storytelling frameworks for LinkedIn",
                "How do I optimize my LinkedIn post for comments?",
                "Suggest hashtags for B2B tech thought leadership"
            ]
        elif "instagram" in p:
            return [
                "How to design a high-saving Instagram carousel",
                "What's the ideal Reel duration for max reach?",
                "Suggest 10 niche hashtags for lifestyle & tech"
            ]
        elif "twitter" in p or "x" in p:
            return [
                "Give me 5 thread hook ideas for X",
                "How to boost replies and bookmarks on X?",
                "Best times to tweet for engagement"
            ]
        elif "youtube" in p:
            return [
                "3 high-CTR YouTube thumbnail and title ideas",
                "How to script the first 30 seconds of a video",
                "YouTube Community post ideas to boost polls"
            ]
        return DEFAULT_SUGGESTIONS[:4]

    async def chat(
        self,
        message: str,
        history: Optional[List[AssistantMessage]] = None,
        platform: Optional[str] = "all",
        context: Optional[Dict[str, Any]] = None,
        user_name: Optional[str] = None
    ) -> AssistantChatResponse:
        """Processes a creator query with Gemini AI and returns an actionable response."""
        now_iso = datetime.now(timezone.utc).isoformat()
        suggestions = self._generate_smart_suggestions(platform)

        if not self.client:
            self._init_client()

        # If Gemini is available and client initialized
        if self.client:
            prompt = self._build_prompt(message, history, platform, context, user_name)
            model_to_use = settings.GEMINI_MODEL or "gemini-3.5-flash"

            try:
                logger.info(f"AssistantService: Calling Gemini with model {model_to_use}...")
                response = self.client.models.generate_content(
                    model=model_to_use,
                    contents=prompt
                )
                if response and response.text:
                    return AssistantChatResponse(
                        reply=response.text.strip(),
                        suggestions=suggestions,
                        model=model_to_use,
                        timestamp=now_iso
                    )
            except Exception as e:
                logger.warning(f"AssistantService: Primary model {model_to_use} failed: {e}. Trying fallback...")
                # Attempt fallback model
                fallback_model = settings.GEMINI_FALLBACK_MODEL or "gemini-3.5-flash-lite"
                try:
                    fb_response = self.client.models.generate_content(
                        model=fallback_model,
                        contents=prompt
                    )
                    if fb_response and fb_response.text:
                        return AssistantChatResponse(
                            reply=fb_response.text.strip(),
                            suggestions=suggestions,
                            model=fallback_model,
                            timestamp=now_iso
                        )
                except Exception as fb_err:
                    logger.error(f"AssistantService: Fallback model failed: {fb_err}")

        # Fallback response if offline or API key missing
        fallback_reply = (
            f"Here are strategic recommendations for your content:\n\n"
            f"1. **Strengthen the First 3 Seconds:** Open with a provocative question or a strong contrast.\n"
            f"2. **Optimize for Platform:** Tailor formatting specifically for {platform.capitalize() if platform else 'your target platform'}.\n"
            f"3. **Clear Call-To-Action:** Prompt your readers to save, comment, or share.\n\n"
            f"*(Note: Live Gemini AI connection was unavailable; this is SocialOpti's built-in framework advice.)*"
        )
        return AssistantChatResponse(
            reply=fallback_reply,
            suggestions=suggestions,
            model="socialopti-heuristic-engine",
            timestamp=now_iso
        )

    def get_quick_suggestions(self) -> List[str]:
        return DEFAULT_SUGGESTIONS


assistant_service = AssistantService()
