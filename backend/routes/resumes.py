from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from typing import List, Optional
from datetime import datetime
import uuid
import io

from models.resume import ResumeVersion, ResumeVersionCreate, ResumeVersionUpdate
from services.supabase_client import get_supabase_client

router = APIRouter()

@router.get("", response_model=List[ResumeVersion])
async def list_resumes():
    """Get all resume versions"""
    supabase = get_supabase_client()
    response = supabase.table("resume_versions").select("*").order("created_at", desc=True).execute()
    return response.data

@router.post("")
async def create_resume(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    target_roles: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Create a new resume version with optional file upload"""
    supabase = get_supabase_client()

    resume_id = str(uuid.uuid4())
    file_path = None
    file_name = None

    # Handle file upload if provided
    if file:
        file_content = await file.read()
        file_path = f"resumes/{resume_id}/{file.filename}"
        file_name = file.filename

        supabase.storage.from_("resumes").upload(
            file_path,
            file_content,
            {"content-type": file.content_type}
        )

    data = {
        "id": resume_id,
        "name": name,
        "description": description,
        "target_roles": target_roles,
        "content": content,
        "file_path": file_path,
        "file_name": file_name,
        "created_at": datetime.utcnow().isoformat()
    }

    response = supabase.table("resume_versions").insert(data).execute()
    return response.data[0]

@router.get("/{resume_id}", response_model=ResumeVersion)
async def get_resume(resume_id: str):
    """Get a single resume version"""
    supabase = get_supabase_client()
    response = supabase.table("resume_versions").select("*").eq("id", resume_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    return response.data[0]

@router.put("/{resume_id}", response_model=ResumeVersion)
async def update_resume(resume_id: str, resume: ResumeVersionUpdate):
    """Update a resume version"""
    supabase = get_supabase_client()

    existing = supabase.table("resume_versions").select("*").eq("id", resume_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    data = {k: v for k, v in resume.model_dump().items() if v is not None}

    response = supabase.table("resume_versions").update(data).eq("id", resume_id).execute()
    return response.data[0]

@router.delete("/{resume_id}")
async def delete_resume(resume_id: str):
    """Delete a resume version"""
    supabase = get_supabase_client()

    # Get resume to find file path
    existing = supabase.table("resume_versions").select("*").eq("id", resume_id).execute()

    if existing.data and existing.data[0].get("file_path"):
        # Delete file from storage
        try:
            supabase.storage.from_("resumes").remove([existing.data[0]["file_path"]])
        except:
            pass  # File might not exist

    # Delete database record
    supabase.table("resume_versions").delete().eq("id", resume_id).execute()

    return {"message": "Resume deleted"}

@router.get("/{resume_id}/download")
async def download_resume(resume_id: str):
    """Download resume file"""
    supabase = get_supabase_client()

    resume = supabase.table("resume_versions").select("*").eq("id", resume_id).execute()

    if not resume.data or not resume.data[0].get("file_path"):
        raise HTTPException(status_code=404, detail="Resume file not found")

    file_path = resume.data[0]["file_path"]
    file_name = resume.data[0].get("file_name", "resume.pdf")

    # Download from Supabase Storage
    file_data = supabase.storage.from_("resumes").download(file_path)

    return StreamingResponse(
        io.BytesIO(file_data),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file_name}"}
    )

@router.post("/{resume_id}/upload")
async def upload_resume_file(resume_id: str, file: UploadFile = File(...)):
    """Upload/replace resume file"""
    supabase = get_supabase_client()

    # Verify resume exists
    existing = supabase.table("resume_versions").select("*").eq("id", resume_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Delete old file if exists
    if existing.data[0].get("file_path"):
        try:
            supabase.storage.from_("resumes").remove([existing.data[0]["file_path"]])
        except:
            pass

    # Upload new file
    file_content = await file.read()
    file_path = f"resumes/{resume_id}/{file.filename}"

    supabase.storage.from_("resumes").upload(
        file_path,
        file_content,
        {"content-type": file.content_type}
    )

    # Update database record
    supabase.table("resume_versions").update({
        "file_path": file_path,
        "file_name": file.filename
    }).eq("id", resume_id).execute()

    return {"message": "File uploaded", "file_path": file_path}
