from pydantic import BaseModel, Field
from .material import Material

class Filament(BaseModel):
    name: str
    brand: str
    color: str
    material: Material
    diameter: float = Field(gt=0)
    price: float = Field(ge=0)

    class Config:
        from_attributes = True

    # Delegate Material properties to the material object
    @property
    def material_name(self) -> str:
        return self.material.name

    @property
    def density(self) -> float:
        return self.material.density

    @property
    def softening_temp(self) -> float:
        return self.material.softening_temp

    @property
    def idle_temp(self) -> float:
        return self.material.idle_temp

    @property
    def min_temp(self) -> float:
        return self.material.min_temp

    @property
    def max_temp(self) -> float:
        return self.material.max_temp

    @property
    def shrinkage(self) -> float:
        return self.material.shrinkage

    @property
    def extrusion_ratio(self) -> float:
        return self.material.extrusion_ratio