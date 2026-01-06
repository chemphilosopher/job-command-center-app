from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class StatusHistoryItem(BaseModel):
    status: str
    date: str
    notes: Optional[str] = None

class QualityInfo(BaseModel):
    customResume: Optional[bool] = False
    customCoverLetter: Optional[bool] = False
    atsOptimized: Optional[bool] = False
    resumeFileName: Optional[str] = None
    coverLetterFileName: Optional[str] = None

class ApplicationBase(BaseModel):
    company: str
    title: str
    location: Optional[str] = None
    region: Optional[str] = None
    job_url: Optional[str] = None
    salary: Optional[str] = None
    company_type: Optional[str] = None
    modality: Optional[List[str]] = []
    date_applied: Optional[str] = None
    status: Optional[str] = "Applied"
    job_description: Optional[str] = None
    tags: Optional[List[str]] = []
    notes: Optional[str] = None
    referral: Optional[str] = None
    application_source: Optional[str] = None
    resume_version: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    region: Optional[str] = None
    job_url: Optional[str] = None
    salary: Optional[str] = None
    company_type: Optional[str] = None
    modality: Optional[List[str]] = None
    date_applied: Optional[str] = None
    status: Optional[str] = None
    status_history: Optional[List[dict]] = None
    job_description: Optional[str] = None
    ai_analysis: Optional[dict] = None
    interview_prep: Optional[dict] = None
    quality: Optional[dict] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    referral: Optional[str] = None
    application_source: Optional[str] = None
    resume_version: Optional[str] = None

class Application(ApplicationBase):
    id: str
    status_history: Optional[List[dict]] = []
    ai_analysis: Optional[dict] = None
    interview_prep: Optional[dict] = None
    quality: Optional[dict] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
