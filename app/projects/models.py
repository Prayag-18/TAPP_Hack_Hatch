from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Project(BaseModel):
    id: str = Field(alias="_id")
    creator_id: str
    title: str
    description: str
    goal_amount: float
    min_investment: float
    status: str
    projected_roi: float
    created_at: datetime
    total_invested: float = 0
    
    class Config:
        populate_by_name = True

class ProjectCreate(BaseModel):
    title: str
    description: str
    goal_amount: float
    min_investment: float
    projected_roi: float
