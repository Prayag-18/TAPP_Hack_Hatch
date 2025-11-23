from fastapi import APIRouter, Depends
from app.auth.routes import get_current_user
from app.compatibility.service import CompatibilityService
from app.compatibility.models import CompatibilityScore

router = APIRouter()
service = CompatibilityService()

@router.post("/recalculate")
async def recalculate_score(target_id: str, target_type: str, current_user: dict = Depends(get_current_user)):
    # Assuming current user is creator
    return await service.calculate_score(current_user["_id"], target_id, target_type)

@router.get("/creator/{creator_id}", response_model=CompatibilityScore)
async def get_compatibility(creator_id: str):
    return await service.get_score(creator_id)
