from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.user import ProfileResponse, ProfileUpdateRequest, SettingsSchema, SettingsUpdateRequest
from app.services.auth_service import get_current_user
from app.services.user_service import get_user_profile, update_user_profile, get_user_settings, update_user_settings
from app.utils.file_storage import save_uploaded_file

router = APIRouter(tags=["User Profile & Settings"])

@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch profile of current user with stats and connected social accounts."""
    return get_user_profile(db, current_user)

@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile details (name, email, phone, bio)."""
    return update_user_profile(db, current_user, req)

@router.post("/profile/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload new avatar image."""
    url_path, filename, size = await save_uploaded_file(file)
    if current_user.profile:
        current_user.profile.avatar_url = url_path
        db.commit()
    return {"url": url_path, "filename": filename}

@router.get("/settings", response_model=SettingsSchema)
def get_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch user settings and notification preferences."""
    return get_user_settings(db, current_user)

@router.put("/settings", response_model=SettingsSchema)
def update_settings(
    req: SettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user notification and theme settings."""
    return update_user_settings(db, current_user, req)
