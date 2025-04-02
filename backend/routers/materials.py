from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from routers.users import get_current_user, User

router = APIRouter(
    prefix="/materials",
    tags=["materials"]
)

# Pydantic models for material data validation
class MaterialBase(BaseModel):
    name: str
    density: float
    softening_temp: float
    idle_temp: float
    min_temp: float
    max_temp: float
    shrinkage: float
    extrusion_ratio: float

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    name: Optional[str] = None
    density: Optional[float] = None
    softening_temp: Optional[float] = None
    idle_temp: Optional[float] = None
    min_temp: Optional[float] = None
    max_temp: Optional[float] = None
    shrinkage: Optional[float] = None
    extrusion_ratio: Optional[float] = None

class Material(MaterialBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True

# In-memory storage (replace with database in production)
materials: dict[int, Material] = {}
current_id: int = 1

@router.post("/", response_model=Material)
async def create_material(material: MaterialCreate, current_user: User = Depends(get_current_user)):
    global current_id
    
    # Create new material
    new_material = Material(
        id=current_id,
        **material.dict(),
        created_at=datetime.utcnow(),
        user_id=current_user.id
    )
    
    materials[current_id] = new_material
    current_id += 1
    return new_material

@router.get("/", response_model=List[Material])
async def read_materials(current_user: User = Depends(get_current_user)):
    # Filter materials by user_id
    return [m for m in materials.values() if m.user_id == current_user.id]

@router.get("/{material_id}", response_model=Material)
async def read_material(material_id: int, current_user: User = Depends(get_current_user)):
    if material_id not in materials:
        raise HTTPException(status_code=404, detail="Material not found")
    
    material = materials[material_id]
    if material.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this material")
    
    return material

@router.put("/{material_id}", response_model=Material)
async def update_material(material_id: int, material: MaterialUpdate, current_user: User = Depends(get_current_user)):
    if material_id not in materials:
        raise HTTPException(status_code=404, detail="Material not found")
    
    db_material = materials[material_id]
    if db_material.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this material")
    
    # Update material fields if provided
    update_data = material.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_material, field, value)
    
    return db_material

@router.delete("/{material_id}")
async def delete_material(material_id: int, current_user: User = Depends(get_current_user)):
    if material_id not in materials:
        raise HTTPException(status_code=404, detail="Material not found")
    
    material = materials[material_id]
    if material.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this material")
    
    del materials[material_id]
    return {"message": "Material deleted successfully"} 