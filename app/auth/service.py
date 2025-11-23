from app.db.mongo import get_database
from app.auth.models import UserCreate, UserLogin
from app.auth.utils import get_password_hash, verify_password, create_access_token, create_refresh_token
from fastapi import HTTPException, status
import uuid
from datetime import datetime

class AuthService:
    async def register(self, user: UserCreate):
        db = await get_database()
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_dict = user.dict()
        user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
        user_dict["_id"] = str(uuid.uuid4())
        user_dict["created_at"] = datetime.utcnow()
        
        await db.users.insert_one(user_dict)
        return user_dict

    async def login(self, user: UserLogin):
        db = await get_database()
        db_user = await db.users.find_one({"email": user.email})
        if not db_user or not verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token(data={"sub": db_user["email"], "id": str(db_user["_id"]), "role": db_user["role"]})
        refresh_token = create_refresh_token(data={"sub": db_user["email"], "id": str(db_user["_id"])})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
