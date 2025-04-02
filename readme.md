# What is it?
The idea behind open filament is to create a platform that allows people to easily register filaments to their slicer for automatic profile switching when 3d printing. Additionally, I would like to have this platform evolve into something that will easily allow users to not only share their own profiles, but allow brands to share profiles too. This way there can be easy to find 'official' profiles for various filaments.

# Why? 
I want to build this platform because currently, switching filament kind of sucks. The printer doesn't know what filament is loaded, nor does the slicer. There are existing RFID based filament systems on the market, such as those from Bambu or Creality, but they're annoying to use - mainly because they only work on their own printers and with their own filaments. I want to build something that is more universal. 

# MVP Requirements:
- A user should be able to use an RFID reader to read an RFID tag on a roll of filament (either a sticker added by the user or possibly one integrated in the spool). 
- A user should be able to create several profiles for that filament.
- The profiles should be as portable as possible (e.g. easy to import into major slicers - Bambu Studio, OrcaSlicer, PrusaSlicer, Cura, &c). 
- A user should be able to switch filaments on a printer, and have the printer automatically contact the slicer to change the filament setting for a given printer - this may require a change where slicers have to be aware of the filament currently loaded in any given printer. This way, a user can hit print, and all of the filament specific settings will automatically be changed over as needed. 

# Additional Notes:
- In addition to RFID, it would be great to create a QR Code generator that contains all of the relevant info for a given filament. This could be printed on the side of a spool of filament and scanned by a computer, the printer itself (if it has a camera) or a cell phone. 
- The filament should also have volumetric flow rate settings - but, the flow rate should depend on the hotend, nozzle, and print temperature (and possibly the extruder used) for the print profile, as these are the things that will determine what level of volumetric flow is possible. 


## To Run:
- Development: `docker compose up --build`
- Production: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build`