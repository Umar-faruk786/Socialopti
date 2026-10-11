import os
import uuid
from fastapi import UploadFile
from app.config import settings

def ensure_upload_dir() -> str:
    """Ensures upload directory exists and returns absolute path."""
    upload_path = os.path.abspath(settings.UPLOAD_DIR)
    os.makedirs(upload_path, exist_ok=True)
    return upload_path

async def save_uploaded_file(file: UploadFile) -> tuple[str, str, int]:
    """
    Saves an uploaded file to the local storage.
    Returns: (file_url_path, stored_filename, file_size_bytes)
    """
    upload_dir = ensure_upload_dir()
    
    # Generate unique filename to avoid collision
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    size = 0
    with open(file_path, "wb") as buffer:
        content = await file.read()
        size = len(content)
        buffer.write(content)
        
    url_path = f"/static/uploads/{unique_filename}"
    return url_path, unique_filename, size
