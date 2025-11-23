from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SocialAccount(BaseModel):
    id: str = Field(alias="_id")
    creator_id: str
    platform: str
    external_channel_id: str
    last_synced_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
