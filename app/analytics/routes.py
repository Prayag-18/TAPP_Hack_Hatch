from fastapi import APIRouter, Depends
from app.auth.routes import get_current_user
from app.analytics.service import AnalyticsService
from app.analytics.models import ChannelSnapshot, Video
from typing import List

router = APIRouter()
service = AnalyticsService()

@router.get("/creator/{creator_id}", response_model=List[ChannelSnapshot])
async def get_creator_analytics(creator_id: str, current_user: dict = Depends(get_current_user)):
    return await service.get_creator_analytics(creator_id)

@router.get("/video/{video_id}", response_model=Video)
async def get_video_analytics(video_id: str, current_user: dict = Depends(get_current_user)):
    return await service.get_video_analytics(video_id)
