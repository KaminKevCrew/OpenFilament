from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from routers.users import get_current_user, User
from routers.materials import Material, materials

router = APIRouter(
    prefix="/filaments",
    tags=["filaments"]
)

# Pydantic models for filament data validation
class FilamentBase(BaseModel):
    name: str
    brand: str
    color: str
    material_id: int
    diameter: float
    price: float

class FilamentCreate(FilamentBase):
    pass

class FilamentUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    color: Optional[str] = None
    material_id: Optional[int] = None
    diameter: Optional[float] = None
    price: Optional[float] = None

class Filament(FilamentBase):
    id: int
    created_at: datetime
    user_id: int
    material: Material

    class Config:
        from_attributes = True

# In-memory storage (replace with database in production)
filaments: dict[int, Filament] = {}
current_id: int = 1

@router.post("/", response_model=Filament)
async def create_filament(filament: FilamentCreate, current_user: User = Depends(get_current_user)):
    global current_id
    
    # Check if material exists and belongs to user
    if filament.material_id not in materials:
        raise HTTPException(status_code=404, detail="Material not found")
    
    material = materials[filament.material_id]
    if material.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to use this material")
    
    # Create new filament
    new_filament = Filament(
        id=current_id,
        **filament.dict(),
        created_at=datetime.utcnow(),
        user_id=current_user.id,
        material=material
    )
    
    filaments[current_id] = new_filament
    current_id += 1
    return new_filament

@router.get("/", response_model=List[Filament])
async def read_filaments(current_user: User = Depends(get_current_user)):
    # Filter filaments by user_id
    return [f for f in filaments.values() if f.user_id == current_user.id]

@router.get("/{filament_id}", response_model=Filament)
async def read_filament(filament_id: int, current_user: User = Depends(get_current_user)):
    if filament_id not in filaments:
        raise HTTPException(status_code=404, detail="Filament not found")
    
    filament = filaments[filament_id]
    if filament.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this filament")
    
    return filament

@router.put("/{filament_id}", response_model=Filament)
async def update_filament(filament_id: int, filament: FilamentUpdate, current_user: User = Depends(get_current_user)):
    if filament_id not in filaments:
        raise HTTPException(status_code=404, detail="Filament not found")
    
    db_filament = filaments[filament_id]
    if db_filament.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this filament")
    
    # Check if new material exists and belongs to user
    if filament.material_id is not None:
        if filament.material_id not in materials:
            raise HTTPException(status_code=404, detail="Material not found")
        
        material = materials[filament.material_id]
        if material.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to use this material")
        db_filament.material = material
    
    # Update filament fields if provided
    update_data = filament.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field != 'material_id':  # Skip material_id as we handled it above
            setattr(db_filament, field, value)
    
    return db_filament

@router.delete("/{filament_id}")
async def delete_filament(filament_id: int, current_user: User = Depends(get_current_user)):
    if filament_id not in filaments:
        raise HTTPException(status_code=404, detail="Filament not found")
    
    filament = filaments[filament_id]
    if filament.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this filament")
    
    del filaments[filament_id]
    return {"message": "Filament deleted successfully"} 