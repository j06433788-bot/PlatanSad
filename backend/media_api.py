"""
Media Library API endpoints for CMS
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from database import get_db, MediaFile
from admin_auth import get_current_admin
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import os
import uuid
import shutil

media_router = APIRouter(prefix="/api/media", tags=["Media"])

# Upload directory
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file types
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


# ============ PYDANTIC MODELS ============

class MediaFileSchema(BaseModel):
    id: str
    filename: str
    original_name: str
    url: str
    file_type: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    alt_text: Optional[str] = None
    title: Optional[str] = None
    folder: str = "general"

class MediaFileUpdate(BaseModel):
    alt_text: Optional[str] = None
    title: Optional[str] = None
    folder: Optional[str] = None


# ============ HELPER FUNCTIONS ============

def get_file_type(mime_type: str) -> str:
    """Determine file type from MIME type"""
    if mime_type in ALLOWED_IMAGE_TYPES:
        return "image"
    elif mime_type in ALLOWED_VIDEO_TYPES:
        return "video"
    elif mime_type in ALLOWED_DOCUMENT_TYPES:
        return "document"
    return "unknown"


# ============ MEDIA ENDPOINTS ============

@media_router.get("/files", response_model=List[dict])
async def get_media_files(
    file_type: Optional[str] = None,
    folder: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Get all media files with optional filtering"""
    query = select(MediaFile)
    
    if file_type:
        query = query.where(MediaFile.file_type == file_type)
    
    if folder:
        query = query.where(MediaFile.folder == folder)
    
    query = query.order_by(MediaFile.created_at.desc())
    query = query.limit(limit).offset(offset)
    
    result = await db.execute(query)
    files = result.scalars().all()
    
    return [
        {
            "id": f.id,
            "filename": f.filename,
            "original_name": f.original_name,
            "url": f.url,
            "file_type": f.file_type,
            "mime_type": f.mime_type,
            "file_size": f.file_size,
            "alt_text": f.alt_text,
            "title": f.title,
            "folder": f.folder,
            "created_at": f.created_at.isoformat() if f.created_at else None
        }
        for f in files
    ]


@media_router.get("/files/{file_id}")
async def get_media_file(file_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single media file by ID"""
    result = await db.execute(
        select(MediaFile).where(MediaFile.id == file_id)
    )
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {
        "id": file.id,
        "filename": file.filename,
        "original_name": file.original_name,
        "url": file.url,
        "file_type": file.file_type,
        "mime_type": file.mime_type,
        "file_size": file.file_size,
        "alt_text": file.alt_text,
        "title": file.title,
        "folder": file.folder,
        "created_at": file.created_at.isoformat() if file.created_at else None
    }


@media_router.post("/upload")
async def upload_media_file(
    file: UploadFile = File(...),
    folder: str = Form(default="general"),
    alt_text: str = Form(default=""),
    title: str = Form(default=""),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Upload a new media file"""
    # Validate file type
    mime_type = file.content_type or ""
    file_type = get_file_type(mime_type)
    
    if file_type == "unknown":
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed: images, videos, PDFs"
        )
    
    # Read file content to check size
    content = await file.read()
    file_size = len(content)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Generate unique filename
    original_name = file.filename or "unknown"
    file_extension = Path(original_name).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Create database record
    media_file = MediaFile(
        filename=unique_filename,
        original_name=original_name,
        url=f"/uploads/{unique_filename}",
        file_type=file_type,
        mime_type=mime_type,
        file_size=file_size,
        alt_text=alt_text or None,
        title=title or original_name,
        folder=folder,
        uploaded_by=current_admin.get("username", "admin")
    )
    
    db.add(media_file)
    await db.commit()
    await db.refresh(media_file)
    
    return {
        "success": True,
        "message": "File uploaded successfully",
        "id": media_file.id,
        "url": media_file.url,
        "filename": media_file.filename,
        "original_name": media_file.original_name,
        "file_type": media_file.file_type,
        "file_size": media_file.file_size
    }


@media_router.put("/files/{file_id}")
async def update_media_file(
    file_id: str,
    update_data: MediaFileUpdate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update media file metadata"""
    result = await db.execute(
        select(MediaFile).where(MediaFile.id == file_id)
    )
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    
    await db.execute(
        update(MediaFile)
        .where(MediaFile.id == file_id)
        .values(**update_dict)
    )
    await db.commit()
    
    return {"success": True, "message": "File updated successfully"}


@media_router.delete("/files/{file_id}")
async def delete_media_file(
    file_id: str,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Delete a media file"""
    result = await db.execute(
        select(MediaFile).where(MediaFile.id == file_id)
    )
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete physical file
    file_path = UPLOAD_DIR / file.filename
    try:
        if file_path.exists():
            os.remove(file_path)
    except Exception as e:
        # Log but don't fail - file might be missing already
        print(f"Warning: Could not delete physical file: {e}")
    
    # Delete database record
    await db.execute(
        delete(MediaFile).where(MediaFile.id == file_id)
    )
    await db.commit()
    
    return {"success": True, "message": "File deleted successfully"}


@media_router.get("/stats")
async def get_media_stats(
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get media library statistics"""
    # Total files
    total_result = await db.execute(select(func.count(MediaFile.id)))
    total_files = total_result.scalar() or 0
    
    # Total size
    size_result = await db.execute(select(func.sum(MediaFile.file_size)))
    total_size = size_result.scalar() or 0
    
    # Count by type
    image_result = await db.execute(
        select(func.count(MediaFile.id)).where(MediaFile.file_type == "image")
    )
    image_count = image_result.scalar() or 0
    
    video_result = await db.execute(
        select(func.count(MediaFile.id)).where(MediaFile.file_type == "video")
    )
    video_count = video_result.scalar() or 0
    
    doc_result = await db.execute(
        select(func.count(MediaFile.id)).where(MediaFile.file_type == "document")
    )
    doc_count = doc_result.scalar() or 0
    
    return {
        "total_files": total_files,
        "total_size": total_size,
        "total_size_formatted": f"{total_size / (1024*1024):.2f} MB",
        "by_type": {
            "images": image_count,
            "videos": video_count,
            "documents": doc_count
        }
    }
