from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from routers.users import get_current_user, User
from routers.filaments import Filament, filaments

router = APIRouter(
    prefix="/spools",
    tags=["spools"]
)

# Pydantic models for spool data validation
class SpoolBase(BaseModel):
    filament_id: int
    starting_weight: float
    starting_length: float
    current_weight: float
    current_length: float

class SpoolCreate(SpoolBase):
    pass

class SpoolUpdate(BaseModel):
    filament_id: Optional[int] = None
    starting_weight: Optional[float] = None
    starting_length: Optional[float] = None
    current_weight: Optional[float] = None
    current_length: Optional[float] = None

class Spool(SpoolBase):
    id: int
    created_at: datetime
    user_id: int
    filament: Filament

    class Config:
        from_attributes = True

# In-memory storage (replace with database in production)
spools: dict[int, Spool] = {}
current_id: int = 1

@router.post("/", response_model=Spool)
async def create_spool(spool: SpoolCreate, current_user: User = Depends(get_current_user)):
    global current_id
    
    # Check if filament exists and belongs to user
    if spool.filament_id not in filaments:
        raise HTTPException(status_code=404, detail="Filament not found")
    
    filament = filaments[spool.filament_id]
    if filament.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to use this filament")
    
    # Create new spool
    new_spool = Spool(
        id=current_id,
        **spool.dict(),
        created_at=datetime.utcnow(),
        user_id=current_user.id,
        filament=filament
    )
    
    spools[current_id] = new_spool
    current_id += 1
    return new_spool

@router.get("/", response_model=List[Spool])
async def read_spools(current_user: User = Depends(get_current_user)):
    # Filter spools by user_id
    return [s for s in spools.values() if s.user_id == current_user.id]

@router.get("/{spool_id}", response_model=Spool)
async def read_spool(spool_id: int, current_user: User = Depends(get_current_user)):
    if spool_id not in spools:
        raise HTTPException(status_code=404, detail="Spool not found")
    
    spool = spools[spool_id]
    if spool.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this spool")
    
    return spool

@router.put("/{spool_id}", response_model=Spool)
async def update_spool(spool_id: int, spool: SpoolUpdate, current_user: User = Depends(get_current_user)):
    if spool_id not in spools:
        raise HTTPException(status_code=404, detail="Spool not found")
    
    db_spool = spools[spool_id]
    if db_spool.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this spool")
    
    # Check if new filament exists and belongs to user
    if spool.filament_id is not None:
        if spool.filament_id not in filaments:
            raise HTTPException(status_code=404, detail="Filament not found")
        
        filament = filaments[spool.filament_id]
        if filament.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to use this filament")
        db_spool.filament = filament
    
    # Update spool fields if provided
    update_data = spool.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field != 'filament_id':  # Skip filament_id as we handled it above
            setattr(db_spool, field, value)
    
    return db_spool

@router.delete("/{spool_id}")
async def delete_spool(spool_id: int, current_user: User = Depends(get_current_user)):
    if spool_id not in spools:
        raise HTTPException(status_code=404, detail="Spool not found")
    
    spool = spools[spool_id]
    if spool.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this spool")
    
    del spools[spool_id]
    return {"message": "Spool deleted successfully"} 