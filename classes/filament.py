from material import Material

class Filament:
    def __init__(self, name: str, brand: str, color: str, material: Material, diameter: float, price: float):
        self._name = name
        self._brand = brand
        self._color = color
        self._material = material
        self._diameter = diameter
        self._price = price

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, value: str):
        self._name = value

    @property
    def brand(self) -> str:
        return self._brand

    @brand.setter
    def brand(self, value: str):
        self._brand = value

    @property
    def color(self) -> str:
        return self._color

    @color.setter
    def color(self, value: str):
        self._color = value

    @property
    def material(self) -> Material:
        return self._material

    @material.setter
    def material(self, value: Material):
        self._material = value

    @property
    def diameter(self) -> float:
        return self._diameter

    @diameter.setter
    def diameter(self, value: float):
        self._diameter = value

    @property
    def price(self) -> float:
        return self._price

    @price.setter
    def price(self, value: float):
        self._price = value

    # Delegate Material properties to the material object
    @property
    def material_name(self) -> str:
        return self._material.name

    @property
    def density(self) -> float:
        return self._material.density

    @property
    def softening_temp(self) -> float:
        return self._material.softening_temp

    @property
    def idle_temp(self) -> float:
        return self._material.idle_temp

    @property
    def min_temp(self) -> float:
        return self._material.min_temp

    @property
    def max_temp(self) -> float:
        return self._material.max_temp

    @property
    def shrinkage(self) -> float:
        return self._material.shrinkage

    @property
    def extrusion_ratio(self) -> float:
        return self._material.extrusion_ratio