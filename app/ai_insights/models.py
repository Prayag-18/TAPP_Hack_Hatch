from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AIJob(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    status: str
    job_type: str
    query: Optional[str] = None
    video_ids: Optional[List[str]] = []
    source_video_ids: Optional[List[str]] = []
    created_at: datetime
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    
    class Config:
        populate_by_name = True

class CommentAnalysisRequest(BaseModel):
    video_ids: List[str] = []
    query: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    context_job_id: Optional[str] = None
