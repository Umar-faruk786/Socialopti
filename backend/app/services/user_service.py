from sqlalchemy.orm import Session
from app.models import User, UserProfile, UserSettings, SocialAccount
from app.schemas.user import ProfileUpdateRequest, SettingsUpdateRequest

def get_user_profile(db: Session, user: User) -> dict:
    profile = user.profile or UserProfile(user_id=user.id, full_name="Creator")
    social_accounts = db.query(SocialAccount).filter(SocialAccount.user_id == user.id).all()
    
    total_analyses = len(user.contents)
    posts_analyzed = len([c for c in user.contents if c.status == "analyzed"])

    return {
        "id": user.id,
        "name": profile.full_name,
        "email": user.email,
        "phone": profile.phone or "+91 98765 43210",
        "role": user.role,
        "bio": profile.bio or "Passionate about AI, Tech and Content Creation.",
        "avatar": profile.avatar_url or "https://i.pravatar.cc/150?img=13",
        "total_analyses": max(128, total_analyses),
        "posts_analyzed": max(56, posts_analyzed),
        "social_accounts": [
            {
                "platform": sa.platform,
                "handle": sa.handle or ("@umarfaruk.tech" if sa.platform == "Instagram" else "Connected" if sa.is_connected else "Not Connected"),
                "connected": sa.is_connected,
                "icon": sa.platform.lower().split(" ")[0]
            }
            for sa in social_accounts
        ]
    }

def update_user_profile(db: Session, user: User, req: ProfileUpdateRequest) -> dict:
    profile = user.profile
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)

    if req.name is not None:
        profile.full_name = req.name
    if req.phone is not None:
        profile.phone = req.phone
    if req.bio is not None:
        profile.bio = req.bio
    if req.avatar is not None:
        profile.avatar_url = req.avatar
    if req.email is not None:
        user.email = req.email.lower()

    db.commit()
    db.refresh(profile)
    return get_user_profile(db, user)

def get_user_settings(db: Session, user: User) -> dict:
    settings = user.settings
    if not settings:
        settings = UserSettings(user_id=user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "theme": settings.theme,
        "email": settings.email_notifications,
        "push": settings.push_notifications,
        "weekly": settings.weekly_digest,
        "marketing": settings.marketing_updates
    }

def update_user_settings(db: Session, user: User, req: SettingsUpdateRequest) -> dict:
    settings = user.settings
    if not settings:
        settings = UserSettings(user_id=user.id)
        db.add(settings)

    if req.theme is not None:
        settings.theme = req.theme
    if req.email is not None:
        settings.email_notifications = req.email
    if req.push is not None:
        settings.push_notifications = req.push
    if req.weekly is not None:
        settings.weekly_digest = req.weekly
    if req.marketing is not None:
        settings.marketing_updates = req.marketing

    db.commit()
    db.refresh(settings)
    return get_user_settings(db, user)
