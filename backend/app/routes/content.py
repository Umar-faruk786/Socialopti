from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User
from app.schemas.content import ContentCreateRequest, ContentResponse, FullOptimizationResponse
from app.services.auth_service import get_current_user
from app.services.content_service import create_and_optimize_content, get_content_by_id, delete_content
from app.utils.file_storage import save_uploaded_file

router = APIRouter(prefix="/content", tags=["Content Management & Optimization"])

@router.post("/upload-media")
async def upload_content_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload media image or video for content optimization."""
    url_path, filename, size = await save_uploaded_file(file)
    is_video = file.content_type.startswith("video/") if file.content_type else False
    return {
        "url": url_path,
        "name": file.filename,
        "size": f"{(size / (1024 * 1024)):.1f} MB",
        "type": file.content_type or "image/jpeg",
        "aspect": "16:9 Video" if is_video else "4:5 Portrait",
        "dimensions": "1920 × 1080 HD" if is_video else "1080 × 1350 High Res"
    }

@router.post("/optimize", response_model=FullOptimizationResponse)
async def optimize_content(
    req: ContentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Core Multi-Agent AI Endpoint:
    Uploads content, triggers all 6 AI agents asynchronously, saves records,
    and returns comprehensive unified analysis, recommendations, and predictions.
    """
    result = await create_and_optimize_content(db, current_user, req)
    return FullOptimizationResponse(
        content=ContentResponse.model_validate(result["content"]),
        analysis=result["analysis"],
        recommendations=result["recommendations"],
        prediction=result["prediction"]
    )

@router.post("", response_model=FullOptimizationResponse)
async def create_content(
    req: ContentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Standard endpoint alias to create & analyze content."""
    return await optimize_content(req, current_user, db)

@router.get("/{content_id}")
def get_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get single content item with associated analysis and predictions."""
    content = get_content_by_id(db, content_id, current_user)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found.")
    return {
        "content": ContentResponse.model_validate(content),
        "analysis": content.analysis,
        "recommendations": content.recommendation,
        "prediction": content.prediction
    }

@router.delete("/{content_id}")
def remove_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a content item and associated AI analysis data."""
    success = delete_content(db, content_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Content not found.")
    return {"message": "Content deleted successfully.", "id": content_id}
