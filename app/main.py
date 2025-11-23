from fastapi import FastAPI # Trigger reload
from app.config.settings import settings
from app.db.mongo import db
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.creators.routes import router as creators_router
from app.brands.routes import router as brands_router
from app.social.routes import router as social_router
from app.analytics.routes import router as analytics_router
from app.ai_insights.routes import router as ai_router
from app.discover.routes import router as discover_router
from app.projects.routes import router as projects_router
from app.investments.routes import router as investments_router
from app.compatibility.routes import router as compatibility_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TAPP API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup_db_client():
    db.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    db.close()

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
# app.include_router(users_router, prefix="/users", tags=["Users"]) # Users mostly handled via auth/me
app.include_router(creators_router, prefix="/creators", tags=["Creators"])
app.include_router(brands_router, prefix="/brands", tags=["Brands"])
app.include_router(social_router, prefix="/social", tags=["Social"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(ai_router, prefix="/ai", tags=["AI Insights"])
app.include_router(discover_router, prefix="/discover", tags=["Discover"])
app.include_router(projects_router, prefix="/projects", tags=["Projects"])
app.include_router(investments_router, prefix="/investments", tags=["Investments"])
app.include_router(compatibility_router, prefix="/compatibility", tags=["Compatibility"])

@app.get("/")
async def root():
    return {"message": "Welcome to TAPP API"}
