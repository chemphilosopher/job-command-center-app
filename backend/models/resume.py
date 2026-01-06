from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ResumeVersionBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_roles: Optional[str] = None
    content: Optional[str] = None

class ResumeVersionCreate(ResumeVersionBase):
    pass

class ResumeVersionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_roles: Optional[str] = None
    content: Optional[str] = None
    file_path: Optional[str] = None
    file_name: Optional[str] = None

class ResumeVersion(ResumeVersionBase):
    id: str
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
