from fastapi import APIRouter, Depends
from app.auth.routes import get_current_user
from app.creators.models import CreatorProfile, CreatorUpdate
from app.creators.service import CreatorService

router = APIRouter()
service = CreatorService()

@router.get("/me", response_model=CreatorProfile)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return await service.get_creator_by_user_id(current_user["_id"])

@router.put("/me")
async def update_creator_profile(profile: CreatorUpdate, current_user: dict = Depends(get_current_user)):
    return await service.update_profile(current_user["_id"], profile)

@router.get("/{creator_id}/analytics")
async def get_creator_analytics(creator_id: str):
    """Get detailed analytics for a creator"""
    return await service.get_creator_analytics(creator_id)

@router.get("/{creator_id}", response_model=CreatorProfile)
async def get_creator(creator_id: str):
    return await service.get_creator(creator_id)
