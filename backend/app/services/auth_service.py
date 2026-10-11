from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProfile, UserSettings, SocialAccount
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.security import verify_password, get_password_hash, create_access_token, decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def register_user(db: Session, req: RegisterRequest) -> User:
    """Registers a new user and creates profile, settings, and social account placeholders."""
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user = User(
        email=req.email.lower(),
        hashed_password=get_password_hash(req.password),
        role="Creator"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create profile
    profile = UserProfile(
        user_id=user.id,
        full_name=req.name,
        phone="+91 98765 43210",
        bio="Social media creator exploring AI-driven engagement.",
        avatar_url="https://i.pravatar.cc/150?img=13"
    )
    db.add(profile)

    # Create settings
    settings = UserSettings(
        user_id=user.id,
        theme="light",
        email_notifications=True,
        push_notifications=True
    )
    db.add(settings)

    # Default social accounts
    for platform in ["Instagram", "LinkedIn", "Facebook", "Twitter (X)", "YouTube"]:
        db.add(SocialAccount(user_id=user.id, platform=platform, is_connected=False))

    db.commit()
    return user

def authenticate_user(db: Session, email: str, password: str) -> User:
    """Authenticates email and password, returning User model or raising 401."""
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to retrieve authenticated user from Bearer JWT token."""
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    return user
