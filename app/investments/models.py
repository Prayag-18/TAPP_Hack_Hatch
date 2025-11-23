from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Investment(BaseModel):
    id: str = Field(alias="_id")
    project_id: str
    investor_id: str
    amount: float
    status: str
    created_at: datetime
    
    class Config:
        populate_by_name = True

class InvestmentCreate(BaseModel):
    amount: float
