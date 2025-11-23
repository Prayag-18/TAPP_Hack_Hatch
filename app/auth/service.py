from app.db.mongo import get_database
from app.auth.models import UserCreate, UserLogin
from app.auth.utils import get_password_hash, verify_password, create_access_token, create_refresh_token
from jose import JWTError, jwt
from app.config.settings import settings
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
        print(f"DEBUG: Login attempt for {user.email}")
        print(f"DEBUG: User found in DB: {db_user is not None}")
        if db_user:
            print(f"DEBUG: Password verification result: {verify_password(user.password, db_user['password_hash'])}")
        
        if not db_user or not verify_password(user.password, db_user["password_hash"]):
            print("DEBUG: Login failed - Invalid credentials")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token(data={"sub": db_user["email"], "id": str(db_user["_id"]), "role": db_user["role"]})
        refresh_token = create_refresh_token(data={"sub": db_user["email"], "id": str(db_user["_id"])})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    async def refresh_token(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("id")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid refresh token")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
        db = await get_database()
        db_user = await db.users.find_one({"_id": user_id})
        if not db_user:
            raise HTTPException(status_code=401, detail="User not found")
            
        access_token = create_access_token(data={"sub": db_user["email"], "id": str(db_user["_id"]), "role": db_user["role"]})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token, # Return same refresh token or rotate if needed
            "token_type": "bearer"
        }
