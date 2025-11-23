from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

class CompatibilityScore(BaseModel):
    id: str = Field(alias="_id")
    creator_id: str
    target_id: str
    target_type: str
    score: float
    breakdown: Dict[str, int]
    calculated_at: datetime
    
    class Config:
        populate_by_name = True
