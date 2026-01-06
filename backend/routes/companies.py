from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
import uuid

from models.company import TargetCompany, TargetCompanyCreate, TargetCompanyUpdate
from services.supabase_client import get_supabase_client

router = APIRouter()

@router.get("", response_model=List[TargetCompany])
async def list_companies():
    """Get all target companies"""
    supabase = get_supabase_client()
    response = supabase.table("target_companies").select("*").order("priority", desc=True).execute()
    return response.data

@router.post("", response_model=TargetCompany)
async def create_company(company: TargetCompanyCreate):
    """Create a new target company"""
    supabase = get_supabase_client()

    data = company.model_dump()
    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()
    data["connections"] = []
    data["research"] = {}

    response = supabase.table("target_companies").insert(data).execute()
    return response.data[0]

@router.get("/{company_id}", response_model=TargetCompany)
async def get_company(company_id: str):
    """Get a single target company"""
    supabase = get_supabase_client()
    response = supabase.table("target_companies").select("*").eq("id", company_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Company not found")

    return response.data[0]

@router.put("/{company_id}", response_model=TargetCompany)
async def update_company(company_id: str, company: TargetCompanyUpdate):
    """Update a target company"""
    supabase = get_supabase_client()

    existing = supabase.table("target_companies").select("*").eq("id", company_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Company not found")

    data = {k: v for k, v in company.model_dump().items() if v is not None}
    data["updated_at"] = datetime.utcnow().isoformat()

    response = supabase.table("target_companies").update(data).eq("id", company_id).execute()
    return response.data[0]

@router.delete("/{company_id}")
async def delete_company(company_id: str):
    """Delete a target company"""
    supabase = get_supabase_client()
    supabase.table("target_companies").delete().eq("id", company_id).execute()
    return {"message": "Company deleted"}
