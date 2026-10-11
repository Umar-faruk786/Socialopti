from typing import Optional
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserBasicInfo"

class UserBasicInfo(BaseModel):
    id: str
    email: str
    name: str
    role: str
    avatar: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

TokenResponse.model_rebuild()
