from pydantic import BaseModel, Field
from typing import Optional, Dict, List

class CreatorProfile(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    display_name: str
    bio: Optional[str] = None
    primary_genre: Optional[str] = None
    region: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Analytics fields
    total_videos: int = 0
    total_views: int = 0
    subscribers: int = 0
    avg_views_per_video: float = 0
    engagement_rate: float = 0
    subscriber_growth_rate: float = 0
    posting_frequency: float = 0
    top_performing_genre: str = ""
    performance_trend: str = "stable"
    audience_demographics: Dict = {}
    last_analytics_update: Optional[str] = None
    
    class Config:
        populate_by_name = True

class CreatorUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    primary_genre: Optional[str] = None
    region: Optional[str] = None
    avatar_url: Optional[str] = None
