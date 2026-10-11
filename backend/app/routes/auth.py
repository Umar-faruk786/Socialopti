from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserBasicInfo
from app.services.auth_service import register_user, authenticate_user, get_current_user
from app.utils.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account and return JWT access token."""
    user = register_user(db, req)
    token = create_access_token(data={"sub": user.id, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserBasicInfo(
            id=user.id,
            email=user.email,
            name=user.profile.full_name if user.profile else req.name,
            role=user.role,
            avatar=user.profile.avatar_url if user.profile else None
        )
    )

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email/password and return JWT token."""
    user = authenticate_user(db, req.email, req.password)
    token = create_access_token(data={"sub": user.id, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserBasicInfo(
            id=user.id,
            email=user.email,
            name=user.profile.full_name if user.profile else "User",
            role=user.role,
            avatar=user.profile.avatar_url if user.profile else None
        )
    )

@router.get("/me", response_model=UserBasicInfo)
def get_me(current_user: User = Depends(get_current_user)):
    """Get currently logged-in user profile basic info."""
    return UserBasicInfo(
        id=current_user.id,
        email=current_user.email,
        name=current_user.profile.full_name if current_user.profile else "User",
        role=current_user.role,
        avatar=current_user.profile.avatar_url if current_user.profile else None
    )
