from typing import Optional, List
from pydantic import BaseModel, EmailStr

class SocialAccountSchema(BaseModel):
    platform: str
    handle: str
    connected: bool
    icon: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

class ProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    bio: str
    avatar: str
    total_analyses: int
    posts_analyzed: int
    social_accounts: List[SocialAccountSchema] = []

class SettingsSchema(BaseModel):
    theme: str = "light"
    email: bool = True
    push: bool = True
    weekly: bool = False
    marketing: bool = False

class SettingsUpdateRequest(BaseModel):
    theme: Optional[str] = None
    email: Optional[bool] = None
    push: Optional[bool] = None
    weekly: Optional[bool] = None
    marketing: Optional[bool] = None
