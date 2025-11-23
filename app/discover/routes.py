from fastapi import APIRouter, Query
from app.discover.service import DiscoverService
from typing import Optional

router = APIRouter()
service = DiscoverService()

@router.get("/creators")
async def discover_creators(
    genre: Optional[str] = None,
    region: Optional[str] = None,
    search: Optional[str] = None,
    min_subs: Optional[int] = None,
    skip: int = 0,
    limit: int = 20,
    sort_by: Optional[str] = "relevance"
):
    return await service.search_creators(genre, region, search, min_subs, skip, limit)

@router.get("/brands")
async def discover_brands():
    return await service.search_brands()
