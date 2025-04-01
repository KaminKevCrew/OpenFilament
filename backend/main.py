from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from routers import users
from routers.users import UserResponse, UserCreate
from passlib.context import CryptContext
from datetime import datetime

app = FastAPI(
    title="OpenFilament API",
    description="API for managing 3D printing materials and filaments",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models for authentication
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Authentication endpoints
@app.post("/auth/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    # Check if user already exists
    if users.get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user using the router's create_user function
    return await users.create_user(user)

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Get user by email
    db_user = users.get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = users.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Include routers
app.include_router(users.router, prefix="/api", tags=["users"])

@app.get("/")
async def root():
    return {"message": "Welcome to OpenFilament API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
