from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io

from services.supabase_client import get_supabase_client

router = APIRouter()

@router.get("/{file_id}")
async def get_file_info(file_id: str):
    """Get file metadata"""
    supabase = get_supabase_client()
    response = supabase.table("application_files").select("*").eq("id", file_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="File not found")

    return response.data[0]

@router.get("/{file_id}/download")
async def download_file(file_id: str):
    """Download a file"""
    supabase = get_supabase_client()

    # Get file info
    file_info = supabase.table("application_files").select("*").eq("id", file_id).execute()

    if not file_info.data:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = file_info.data[0]["file_path"]
    file_name = file_info.data[0]["file_name"]

    # Download from storage
    file_data = supabase.storage.from_("application-files").download(file_path)

    return StreamingResponse(
        io.BytesIO(file_data),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file_name}"}
    )

@router.delete("/{file_id}")
async def delete_file(file_id: str):
    """Delete a file"""
    supabase = get_supabase_client()

    # Get file info
    file_info = supabase.table("application_files").select("*").eq("id", file_id).execute()

    if not file_info.data:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = file_info.data[0]["file_path"]

    # Delete from storage
    try:
        supabase.storage.from_("application-files").remove([file_path])
    except:
        pass  # File might not exist in storage

    # Delete database record
    supabase.table("application_files").delete().eq("id", file_id).execute()

    return {"message": "File deleted"}
