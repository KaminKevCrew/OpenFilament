from pydantic import BaseModel, Field

class Material(BaseModel):
    name: str
    density: float = Field(gt=0)
    softening_temp: float = Field(gt=0)
    idle_temp: float = Field(gt=0)
    min_temp: float = Field(gt=0)
    max_temp: float = Field(gt=0)
    shrinkage: float = Field(ge=0, le=1)
    extrusion_ratio: float = Field(gt=0)

    class Config:
        from_attributes = True
        
    