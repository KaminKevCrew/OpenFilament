from filament import Filament

class Spool(Filament):
    def __init__(self, spool_id: int, starting_weight: float, starting_length: float)
        self.spool_id = spool_id
        self.starting_weight = starting_weight
        self.starting_length = starting_length
        self.current_weight = starting_weight
        self.current_length = starting_length
        
    def use_spool(self, length: float):
        self.current_length -= length
        self.current_weight -= length * self.filament.density

    


# An individual spool of filament has its own ID, which it gets from the RFID tag. 
# An individual spool of filament has a starting weight and starting length. 
# An individual spool of filament has a current weight and current length. 
