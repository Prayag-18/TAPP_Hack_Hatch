from fastapi import APIRouter, Depends
from app.auth.routes import get_current_user
from app.projects.service import ProjectService
from app.projects.models import Project, ProjectCreate
from app.investments.service import InvestmentService
from app.investments.models import Investment, InvestmentCreate
from typing import List

router = APIRouter()
service = ProjectService()
investment_service = InvestmentService()

@router.get("/public")
async def list_public_projects(
    skip: int = 0,
    limit: int = 20,
    status: str = "LIVE",
    sort_by: str = "recent"
):
    """List all public projects available for investment"""
    return await service.list_public_projects(skip, limit, status, sort_by)

@router.post("/", response_model=Project)
async def create_project(project: ProjectCreate, current_user: dict = Depends(get_current_user)):
    # Get creator_id from user
    from app.creators.service import CreatorService
    creator_service = CreatorService()
    creator = await creator_service.get_creator_by_user_id(current_user["_id"])
    
    # If creator profile doesn't exist, create a basic one
    if not creator:
        creator = await creator_service.create_profile(current_user["_id"], {
            "display_name": current_user.get("email", "Creator").split("@")[0],
            "bio": "New creator on TAPP",
            "primary_genre": "General",
            "region": "Global"
        })
    
    return await service.create_project(creator["_id"], project)

@router.get("/", response_model=List[Project])
async def list_projects():
    return await service.get_projects()

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    return await service.get_project(project_id)

@router.post("/{project_id}/invest", response_model=Investment)
async def invest_in_project(project_id: str, investment: InvestmentCreate, current_user: dict = Depends(get_current_user)):
    return await investment_service.invest(current_user["_id"], project_id, investment)

@router.post("/{project_id}/revenue-report")
async def add_revenue_report(project_id: str, total_revenue: float, current_user: dict = Depends(get_current_user)):
    """Add revenue report and distribute payouts to investors"""
    return await service.add_revenue_report(project_id, total_revenue)
