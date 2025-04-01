class Material:
    def __init__(self, name: str, density: float, softening_temp: float, idle_temp: float, min_temp: float, max_temp: float, shrinkage: float, extrusion_ratio: float): # A material will have default print settings, which can be overridden by the user - specifically in the filament class.
        self._name = name
        self._density = density
        self._softening_temp = softening_temp
        self._idle_temp = idle_temp
        self._min_temp = min_temp
        self._max_temp = max_temp
        self._shrinkage = shrinkage
        self._extrusion_ratio = extrusion_ratio

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, value: str):
        self._name = value

    @property
    def density(self) -> float:
        return self._density

    @density.setter
    def density(self, value: float):
        self._density = value

    @property
    def softening_temp(self) -> float:
        return self._softening_temp

    @softening_temp.setter
    def softening_temp(self, value: float):
        self._softening_temp = value

    @property
    def idle_temp(self) -> float:
        return self._idle_temp

    @idle_temp.setter
    def idle_temp(self, value: float):
        self._idle_temp = value

    @property
    def min_temp(self) -> float:
        return self._min_temp

    @min_temp.setter
    def min_temp(self, value: float):
        self._min_temp = value

    @property
    def max_temp(self) -> float:
        return self._max_temp

    @max_temp.setter
    def max_temp(self, value: float):
        self._max_temp = value

    @property
    def shrinkage(self) -> float:
        return self._shrinkage

    @shrinkage.setter
    def shrinkage(self, value: float):
        self._shrinkage = value

    @property
    def extrusion_ratio(self) -> float:
        return self._extrusion_ratio

    @extrusion_ratio.setter
    def extrusion_ratio(self, value: float):
        self._extrusion_ratio = value
        
    