from pydantic import BaseModel, Field
from typing import Optional

class BrandProfile(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    brand_name: str
    industry: Optional[str] = None
    region: Optional[str] = None
    budget_band: Optional[str] = None
    
    class Config:
        populate_by_name = True

class BrandUpdate(BaseModel):
    brand_name: Optional[str] = None
    industry: Optional[str] = None
    region: Optional[str] = None
    budget_band: Optional[str] = None
