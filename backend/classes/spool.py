from pydantic import BaseModel, Field
from .filament import Filament

class Spool(Filament):
    spool_id: int
    starting_weight: float = Field(gt=0)
    starting_length: float = Field(gt=0)
    current_weight: float = Field(gt=0)
    current_length: float = Field(gt=0)

    class Config:
        from_attributes = True

    def use_spool(self, length: float):
        self.current_length = self.current_length - length
        self.current_weight = self.current_weight - (length * self.material.density)

    @property
    def spool_id(self) -> int:
        return self._spool_id

    @spool_id.setter
    def spool_id(self, value: int):
        self._spool_id = value

    @property
    def starting_weight(self) -> float:
        return self._starting_weight

    @starting_weight.setter
    def starting_weight(self, value: float):
        self._starting_weight = value

    @property
    def starting_length(self) -> float:
        return self._starting_length

    @starting_length.setter
    def starting_length(self, value: float):
        self._starting_length = value

    @property
    def current_weight(self) -> float:
        return self._current_weight

    @current_weight.setter
    def current_weight(self, value: float):
        self._current_weight = value

    @property
    def current_length(self) -> float:
        return self._current_length

    @current_length.setter
    def current_length(self, value: float):
        self._current_length = value