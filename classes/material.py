class Material:
    def __init__(self, name: str, density: float): # A material will have default print settings, which can be overridden by the user - specifically in the filament class.
        self.name = name
        self.density = density