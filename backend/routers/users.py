from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional
from passlib.context import CryptContext
from datetime import datetime
from jose import JWTError, jwt
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-here"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic model for user data validation
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: constr(min_length=8)  # Password must be at least 8 characters

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=8)] = None

class User(UserBase):
    id: int
    hashed_password: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# In-memory storage (replace with database in production)
users: dict[int, User] = {}
current_id: int = 1

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user_by_email(email: str) -> Optional[User]:
    for user in users.values():
        if user.email == email:
            return user
    return None

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def add_user(user: User) -> User:
    global current_id
    user.id = current_id
    users[current_id] = user
    current_id += 1
    return user

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    global current_id
    
    # Check if username or email already exists
    if any(u.username == user.username for u in users.values()):
        raise HTTPException(status_code=400, detail="Username already exists")
    if any(u.email == user.email for u in users.values()):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create new user with hashed password
    new_user = User(
        id=current_id,
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        created_at=datetime.utcnow()
    )
    
    users[current_id] = new_user
    current_id += 1
    return new_user

@router.get("/", response_model=List[UserResponse])
async def read_users():
    return list(users.values())

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(user_id: int):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    return users[user_id]

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user: UserUpdate):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if new username or email conflicts with existing users
    if user.username and any(u.username == user.username and u.id != user_id for u in users.values()):
        raise HTTPException(status_code=400, detail="Username already exists")
    if user.email and any(u.email == user.email and u.id != user_id for u in users.values()):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Update user fields if provided
    if user.username:
        users[user_id].username = user.username
    if user.email:
        users[user_id].email = user.email
    if user.password:
        users[user_id].hashed_password = get_password_hash(user.password)
    
    return users[user_id]

@router.delete("/{user_id}")
async def delete_user(user_id: int):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    
    del users[user_id]
    return {"message": "User deleted successfully"}
