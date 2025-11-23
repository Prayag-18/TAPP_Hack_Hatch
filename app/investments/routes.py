from fastapi import APIRouter, Depends
from app.auth.routes import get_current_user
from app.investments.service import InvestmentService
from app.investments.models import Investment, InvestmentCreate
from typing import List

router = APIRouter()
service = InvestmentService()

@router.get("/me", response_model=List[Investment])
async def get_my_investments(current_user: dict = Depends(get_current_user)):
    return await service.get_my_investments(current_user["_id"])
