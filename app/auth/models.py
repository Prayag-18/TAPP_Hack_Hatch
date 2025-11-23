from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    CREATOR = "CREATOR"
    BRAND = "BRAND"
    FAN = "FAN"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    role: UserRole
    
    class Config:
        populate_by_name = True
