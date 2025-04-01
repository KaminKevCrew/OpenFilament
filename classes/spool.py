from filament import Filament

class Spool(Filament):
    def __init__(self, spool_id: int, starting_weight: float, starting_length: float):
        self._spool_id = spool_id
        self._starting_weight = starting_weight
        self._starting_length = starting_length
        self._current_weight = starting_weight
        self._current_length = starting_length
        
    def use_spool(self, length: float):
        self.current_length = self.current_length - length
        self.current_weight = self.current_weight - (length * self.filament.density)

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