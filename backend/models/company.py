from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TargetCompanyBase(BaseModel):
    name: str
    category: Optional[str] = None
    priority: Optional[int] = 3
    status: Optional[str] = "Researching"
    careers_url: Optional[str] = None
    notes: Optional[str] = None

class TargetCompanyCreate(TargetCompanyBase):
    pass

class TargetCompanyUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[int] = None
    status: Optional[str] = None
    careers_url: Optional[str] = None
    research: Optional[dict] = None
    connections: Optional[List[dict]] = None
    notes: Optional[str] = None

class TargetCompany(TargetCompanyBase):
    id: str
    research: Optional[dict] = None
    connections: Optional[List[dict]] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
