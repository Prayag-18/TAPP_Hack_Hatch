from fastapi import APIRouter, Depends, HTTPException
from app.auth.routes import get_current_user
from app.ai_insights.service import AIService
from app.ai_insights.models import AIJob, CommentAnalysisRequest, ChatRequest

router = APIRouter()
service = AIService()

@router.get("/available-queries")
async def get_available_queries():
    """Get list of available AI query templates"""
    return {
        "queries": [
            {
                "id": "sentiment",
                "title": "Sentiment Analysis",
                "description": "Analyze the overall sentiment of comments"
            },
            {
                "id": "themes",
                "title": "Theme Extraction",
                "description": "Extract recurring themes from comments"
            },
            {
                "id": "suggestions",
                "title": "Content Suggestions",
                "description": "Get content ideas based on audience feedback"
            },
            {
                "id": "performance",
                "title": "Performance Analysis",
                "description": "Understand why videos performed well or poorly"
            }
        ]
    }

@router.get("/available-videos")
async def get_available_videos(current_user: dict = Depends(get_current_user)):
    """Get list of videos available for AI analysis"""
    from app.db.mongo import get_database
    from app.creators.service import CreatorService
    
    creator_service = CreatorService()
    creator = await creator_service.get_creator_by_user_id(current_user["_id"])
    
    if not creator:
        return {"videos": []}
    
    db = await get_database()
    # Get social accounts for this creator
    social_accounts = await db.social_accounts.find({"creator_id": creator["_id"]}).to_list(length=10)
    
    if not social_accounts:
        return {"videos": []}
    
    account_ids = [acc["_id"] for acc in social_accounts]
    
    # Get videos
    videos = await db.videos.find({"social_account_id": {"$in": account_ids}}).to_list(length=50)
    
    return {
        "videos": [
            {
                "id": v["_id"],
                "title": v["title"],
                "views": v.get("views", 0),
                "published_at": v.get("published_at").isoformat() if v.get("published_at") else None
            }
            for v in videos
        ]
    }

@router.post("/comment-analysis", response_model=AIJob)
async def create_analysis_job(request: CommentAnalysisRequest, current_user: dict = Depends(get_current_user)):
    return await service.create_comment_analysis_job(current_user["_id"], request)

@router.get("/jobs/{job_id}", response_model=AIJob)
async def get_job_status(job_id: str, current_user: dict = Depends(get_current_user)):
    return await service.get_job(job_id)

@router.post("/chat")
async def chat_with_insights(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    return await service.chat(current_user["_id"], request.message, request.context_job_id)
