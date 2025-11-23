from app.db.mongo import get_database
from app.ai_insights.models import CommentAnalysisRequest
import uuid
from datetime import datetime
import random

class AIService:
    async def create_comment_analysis_job(self, user_id: str, request: CommentAnalysisRequest):
        """Create AI analysis job and process it immediately (mock)"""
        db = await get_database()
        
        job_id = str(uuid.uuid4())
        
        # Create job record
        job = {
            "_id": job_id,
            "user_id": user_id,
            "status": "COMPLETED",  # Complete immediately since it's mock
            "job_type": "COMMENT_ANALYSIS",
            "query": request.query,
            "video_ids": request.video_ids,
            "source_video_ids": request.video_ids,  # Add this
            "created_at": datetime.utcnow(),
            "completed_at": datetime.utcnow(),
            "result": self._generate_mock_result(request.query)
        }
        
        await db.ai_jobs.insert_one(job)
        return job
    
    def _generate_mock_result(self, query: str):
        """Generate mock AI analysis results"""
        return {
            "sentiment": {
                "positive": random.randint(50, 80),
                "neutral": random.randint(10, 30),
                "negative": random.randint(5, 20)
            },
            "themes": [
                "Content Quality",
                "Production Value",
                "Educational Content",
                "Entertainment Value",
                "Engagement"
            ][:random.randint(3, 5)],
            "summary": f"Based on the analysis of your content regarding '{query}', your audience shows strong positive sentiment. "
                      f"Key themes include high production quality and engaging content. "
                      f"Viewers appreciate your educational approach and consistent posting schedule. "
                      f"Consider exploring more interactive content formats to boost engagement further.",
            "suggestions": [
                "Increase video frequency to 2-3 times per week",
                "Add more interactive elements like polls and Q&A",
                "Focus on trending topics in your niche",
                "Improve thumbnail design for better CTR"
            ]
        }
    
    async def get_job(self, job_id: str):
        """Get job status and results"""
        db = await get_database()
        job = await db.ai_jobs.find_one({"_id": job_id})
        
        if not job:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Job not found")
        
        return job
    
    async def chat(self, user_id: str, message: str, context_job_id: str = None):
        """Mock AI chat"""
        responses = [
            "Based on your content analysis, I recommend focusing on audience retention in the first 30 seconds.",
            "Your engagement metrics suggest that tutorial-style content performs best with your audience.",
            "Consider creating a content series to build anticipation and recurring viewership.",
            "The data shows your audience is most active on weekends - schedule posts accordingly.",
            "Your comment sentiment is overwhelmingly positive - leverage this by encouraging more interaction."
        ]
        
        return {
            "response": random.choice(responses),
            "timestamp": datetime.utcnow().isoformat()
        }
