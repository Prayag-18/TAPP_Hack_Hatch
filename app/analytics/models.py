from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ChannelSnapshot(BaseModel):
    id: str = Field(alias="_id")
    social_account_id: str
    date: datetime
    subscribers: int
    views: int
    watch_time: int
    estimated_revenue: float
    engagement_rate: float
    
    class Config:
        populate_by_name = True

class Video(BaseModel):
    id: str = Field(alias="_id")
    social_account_id: str
    external_video_id: str
    title: str
    published_at: datetime
    views: int
    likes: int
    comments_count: int
    shares: int
    
    class Config:
        populate_by_name = True
