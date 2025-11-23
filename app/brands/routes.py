from fastapi import APIRouter, Depends
from app.auth.routes import get_current_user
from app.brands.models import BrandProfile, BrandUpdate
from app.brands.service import BrandService

router = APIRouter()
service = BrandService()

@router.get("/me", response_model=BrandProfile)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return await service.get_brand_by_user_id(current_user["_id"])

@router.put("/me", response_model=BrandProfile)
async def update_my_profile(update_data: BrandUpdate, current_user: dict = Depends(get_current_user)):
    return await service.update_profile(current_user["_id"], update_data)

@router.get("/{brand_id}", response_model=BrandProfile)
async def get_brand(brand_id: str):
    return await service.get_brand(brand_id)
