from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime
import uuid

from models.application import Application, ApplicationCreate, ApplicationUpdate
from services.supabase_client import get_supabase_client

router = APIRouter()

@router.get("", response_model=List[Application])
async def list_applications():
    """Get all applications"""
    supabase = get_supabase_client()
    response = supabase.table("applications").select("*").order("created_at", desc=True).execute()
    return response.data

@router.post("", response_model=Application)
async def create_application(application: ApplicationCreate):
    """Create a new application"""
    supabase = get_supabase_client()

    data = application.model_dump()
    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()
    data["status_history"] = [{"status": data.get("status", "Applied"), "date": datetime.utcnow().isoformat()}]

    response = supabase.table("applications").insert(data).execute()
    return response.data[0]

@router.get("/export-for-llm")
async def export_for_llm():
    """Export application data formatted for LLM chatbot feedback"""
    supabase = get_supabase_client()

    # Get all applications
    apps_response = supabase.table("applications").select("*").execute()
    applications = apps_response.data

    # Get all resumes
    resumes_response = supabase.table("resume_versions").select("*").execute()
    resumes = resumes_response.data

    # Format for LLM
    export_text = """# Job Search Summary for AI Feedback

## Overview
Total Applications: {total_apps}
Active Applications: {active_apps}
Interview Stage: {interview_apps}
Offers: {offers}
Rejections: {rejections}

## Applications by Status
{status_breakdown}

## Detailed Application List
{applications_detail}

## Resume Versions
{resumes_detail}

## Questions for AI Feedback:
1. Based on my application patterns, what should I focus on?
2. Are there any gaps in my job search strategy?
3. What can I improve in my approach?
4. Which applications should I prioritize for follow-up?
"""

    # Calculate stats
    status_counts = {}
    for app in applications:
        status = app.get("status", "Unknown")
        status_counts[status] = status_counts.get(status, 0) + 1

    active_statuses = ["Applied", "Reviewed", "Phone Screen", "Technical", "Onsite"]
    active_count = sum(status_counts.get(s, 0) for s in active_statuses)
    interview_count = sum(status_counts.get(s, 0) for s in ["Phone Screen", "Technical", "Onsite"])

    # Format status breakdown
    status_breakdown = "\n".join([f"- {status}: {count}" for status, count in status_counts.items()])

    # Format applications detail
    apps_detail = []
    for app in applications[:20]:  # Limit to 20 most recent
        apps_detail.append(f"""
### {app.get('company', 'Unknown')} - {app.get('title', 'Unknown')}
- Status: {app.get('status', 'Unknown')}
- Applied: {app.get('date_applied', 'Unknown')}
- Location: {app.get('location', 'Not specified')}
- Company Type: {app.get('company_type', 'Not specified')}
- Job Description: {(app.get('job_description', '') or '')[:500]}{'...' if len(app.get('job_description', '') or '') > 500 else ''}
""")

    # Format resumes
    resumes_detail = []
    for resume in resumes:
        resumes_detail.append(f"""
### {resume.get('name', 'Unnamed Resume')}
- Target Roles: {resume.get('target_roles', 'Not specified')}
- Description: {resume.get('description', 'No description')}
""")

    formatted_export = export_text.format(
        total_apps=len(applications),
        active_apps=active_count,
        interview_apps=interview_count,
        offers=status_counts.get("Offer", 0),
        rejections=status_counts.get("Rejected", 0),
        status_breakdown=status_breakdown,
        applications_detail="\n".join(apps_detail) if apps_detail else "No applications yet",
        resumes_detail="\n".join(resumes_detail) if resumes_detail else "No resumes uploaded"
    )

    return {"text": formatted_export, "format": "markdown"}

@router.get("/{application_id}", response_model=Application)
async def get_application(application_id: str):
    """Get a single application"""
    supabase = get_supabase_client()
    response = supabase.table("applications").select("*").eq("id", application_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Application not found")

    return response.data[0]

@router.put("/{application_id}", response_model=Application)
async def update_application(application_id: str, application: ApplicationUpdate):
    """Update an application"""
    supabase = get_supabase_client()

    # Get existing application
    existing = supabase.table("applications").select("*").eq("id", application_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Application not found")

    data = {k: v for k, v in application.model_dump().items() if v is not None}
    data["updated_at"] = datetime.utcnow().isoformat()

    # If status changed, update status history
    if "status" in data and data["status"] != existing.data[0].get("status"):
        history = existing.data[0].get("status_history", []) or []
        history.append({"status": data["status"], "date": datetime.utcnow().isoformat()})
        data["status_history"] = history

    response = supabase.table("applications").update(data).eq("id", application_id).execute()
    return response.data[0]

@router.delete("/{application_id}")
async def delete_application(application_id: str):
    """Delete an application"""
    supabase = get_supabase_client()

    # Delete associated files first
    supabase.table("application_files").delete().eq("application_id", application_id).execute()

    # Delete the application
    response = supabase.table("applications").delete().eq("id", application_id).execute()

    return {"message": "Application deleted"}

@router.post("/{application_id}/files")
async def upload_application_file(
    application_id: str,
    file: UploadFile = File(...),
    file_type: str = Form(...)  # 'resume' or 'cover_letter'
):
    """Upload a file to an application"""
    supabase = get_supabase_client()

    # Verify application exists
    app_check = supabase.table("applications").select("id").eq("id", application_id).execute()
    if not app_check.data:
        raise HTTPException(status_code=404, detail="Application not found")

    # Read file content
    content = await file.read()
    file_path = f"applications/{application_id}/{file_type}/{file.filename}"

    # Upload to Supabase Storage
    storage_response = supabase.storage.from_("application-files").upload(
        file_path,
        content,
        {"content-type": file.content_type}
    )

    # Save file record to database
    file_record = {
        "id": str(uuid.uuid4()),
        "application_id": application_id,
        "file_type": file_type,
        "file_name": file.filename,
        "file_path": file_path,
        "created_at": datetime.utcnow().isoformat()
    }

    supabase.table("application_files").insert(file_record).execute()

    return {"message": "File uploaded", "file_path": file_path}

@router.get("/{application_id}/files")
async def list_application_files(application_id: str):
    """List files for an application"""
    supabase = get_supabase_client()
    response = supabase.table("application_files").select("*").eq("application_id", application_id).execute()
    return response.data
