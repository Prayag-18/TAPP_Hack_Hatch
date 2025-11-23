from app.db.mongo import get_database
from app.projects.models import ProjectCreate
from fastapi import HTTPException
import uuid
from datetime import datetime

class ProjectService:
    async def create_project(self, creator_id: str, project: ProjectCreate):
        db = await get_database()
        data = project.dict()
        data["_id"] = str(uuid.uuid4())
        data["creator_id"] = creator_id
        data["status"] = "LIVE"
        data["created_at"] = datetime.utcnow()
        data["total_invested"] = 0
        
        await db.projects.insert_one(data)
        return data

    async def get_projects(self):
        db = await get_database()
        projects = await db.projects.find().to_list(length=100)
        
        # Add total_invested for each project
        for project in projects:
            investments = await db.investments.find({"project_id": project["_id"]}).to_list(length=1000)
            project["total_invested"] = sum(inv.get("amount", 0) for inv in investments)
        
        return projects
    
    async def list_public_projects(self, skip: int = 0, limit: int = 20, status: str = "LIVE", sort_by: str = "recent"):
        """List all public projects with creator info"""
        db = await get_database()
        
        # Build query
        query = {}
        if status:
            query["status"] = status
        
        # Build sort
        sort_field = "created_at" if sort_by == "recent" else "goal_amount"
        sort_direction = -1
        
        # Get projects
        projects = await db.projects.find(query).sort(sort_field, sort_direction).skip(skip).limit(limit).to_list(length=limit)
        
        # Enrich with creator info and investment stats
        for project in projects:
            # Get creator
            creator = await db.creators.find_one({"_id": project["creator_id"]})
            if creator:
                project["creator_name"] = creator.get("display_name", "Unknown")
                project["creator_avatar"] = creator.get("avatar_url", "")
            
            # Get investment stats
            investments = await db.investments.find({"project_id": project["_id"]}).to_list(length=1000)
            project["total_invested"] = sum(inv.get("amount", 0) for inv in investments)
            project["investor_count"] = len(investments)
            project["funding_percentage"] = round((project["total_invested"] / project["goal_amount"]) * 100, 2) if project["goal_amount"] > 0 else 0
        
        return projects

    async def get_project(self, project_id: str):
        db = await get_database()
        project = await db.projects.find_one({"_id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Add total_invested
        investments = await db.investments.find({"project_id": project_id}).to_list(length=1000)
        project["total_invested"] = sum(inv.get("amount", 0) for inv in investments)
        
        return project
    
    async def add_revenue_report(self, project_id: str, total_revenue: float):
        """Add revenue report and calculate payouts"""
        db = await get_database()
        project = await self.get_project(project_id)
        
        # Get all investments
        investments = await db.investments.find({"project_id": project_id}).to_list(length=1000)
        
        total_invested = sum(inv.get("amount", 0) for inv in investments)
        
        if total_invested == 0:
            raise HTTPException(status_code=400, detail="No investments to distribute")
        
        # Calculate payouts
        payouts = []
        for inv in investments:
            share = inv["amount"] / total_invested
            payout_amount = total_revenue * share
            payouts.append({
                "_id": str(uuid.uuid4()),
                "project_id": project_id,
                "investor_id": inv["investor_id"],
                "investment_id": inv["_id"],
                "amount": payout_amount,
                "created_at": datetime.utcnow()
            })
        
        # Store payouts
        if payouts:
            await db.revenue_payouts.insert_many(payouts)
        
        # Update project
        await db.projects.update_one(
            {"_id": project_id},
            {"$set": {
                "status": "COMPLETED",
                "total_revenue": total_revenue,
                "completed_at": datetime.utcnow()
            }}
        )
        
        return {
            "project_id": project_id,
            "total_revenue": total_revenue,
            "total_invested": total_invested,
            "payouts_created": len(payouts)
        }
