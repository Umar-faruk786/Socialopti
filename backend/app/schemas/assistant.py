from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class AssistantMessage(BaseModel):
    role: str = Field(description="Role of the speaker: user, assistant, or system")
    content: str = Field(description="Message body")

class AssistantChatRequest(BaseModel):
    message: str = Field(..., description="User question or instruction for the AI assistant")
    history: Optional[List[AssistantMessage]] = Field(default_factory=list, description="Prior conversation history")
    platform: Optional[str] = Field(default="all", description="Target platform (instagram, linkedin, twitter, youtube, or all)")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Optional extra context (e.g. recent post title, goals)")

class AssistantChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = Field(default_factory=list)
    model: str
    timestamp: str

class AssistantSuggestionsResponse(BaseModel):
    suggestions: List[str]
