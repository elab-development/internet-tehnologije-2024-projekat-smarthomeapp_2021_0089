from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import get_db
import models
from sqlalchemy import asc, desc
from typing import List
from dependencies import get_current_user
import schemas


router = APIRouter()
"""
Kombinovana funkcija za paginaciju, filtriranje i sortiranje uredjaja
Parametri:
- page (int): Stranica rezultata, podrazumevano 1
- page_size (int): Broj rezultata po stranici, podrazumevano 10
- location_id (int): ID lokacije za filtriranje (opciono)
- device_type (str): Tip uredjaja za filtriranje (opciono)
- sort (str): Redosled sortiranja (asc ili desc), podrazumevano asc
"""
@router.get("/devices/")
def get_devices(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    location_id: int = Query(None),
    device_type: str = Query(None),
    sort: str = Query("asc", enum=["asc", "desc"]),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):

    """
    Kombinovana funkcija za paginaciju, filtriranje i sortiranje uredjaja.
    """
    try:
        # Inicijalni upit
        user_locations = current_user.locations

        if not user_locations:
            raise HTTPException(status_code=404, detail="No locations found for the user")

        # Dohvati uređaje sa tih lokacija
        query = (
            db.query(models.Device)
            .filter(models.Device.location_id.in_([loc.location_id for loc in user_locations]))    
        )
        # Filtriranje prema lokaciji
        if location_id is not None:
            query = query.join(models.Location).filter(models.Location.location_id == location_id)
        # Filtriranje prema tipu uredjaja
        if device_type is not None:
            query = query.filter(models.Device.device_type == device_type)
        # Sortiranje prema tipu uredjaja
        if sort == "asc":
            query = query.order_by(asc(models.Device.device_type))
        elif sort == "desc":
            query = query.order_by(desc(models.Device.device_type))
        # Paginacija
        offset = (page - 1) * page_size
        devices = query.offset(offset).limit(page_size).all()
         # Ukupno pronadjenih uredjaja
        total_devices = query.count()
        # Vracanje rezultata
        return {"page": page, "page_size": page_size, "total_devices": total_devices, "data": devices} #vraca se JSON
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greska prilikom pronalazenja uredjaja: {str(e)}") from e
    
    #ako se vrati prazna lista znaci da nema podataka po zadatim filterima
    
# primer: Paginacija bez filtriranja:GET /devices/?page=1&page_size=5
#Filtriranje po lokaciji i paginacija:GET /devices/?location_id=2&page=1&page_size=5
#Sortiranje i filtriranje:GET /devices/?device_type=sensor&sort=desc&page=2&page_size=3
#RAZDVOJENE RUTE ZA FILTRIRANJE, PAGINACIJU I SORTIRANJE
'''#PAGINACIJA
@router.get("/devices/")
def get_devices(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100), db: Session = Depends(get_db)):
    #page: int = Query(1, ge=1) stranica koju korisnik trazi -> podrazumevana je prva, ne moze biti manja od 1 (greater or equal to 1)
    #page_size: int = Query(10, ge=1, le=100) broj rezultata po stranici, podr. je 10, mora biti izmedju 10 i 100
    offset = (page - 1) * page_size #preskace redove iz baze koji su prikazani na preth. str.
    devices = db.query(models.Device).offset(offset).limit(page_size).all() #upit
    return {"page": page, "page_size": page_size, "data": devices} #vraca se JSON
#FILTRIRANJE
@router.get("/devices/{location_id}")
def get_devices_by_location(location_id: int, db: Session = Depends(get_db)):
    # Filtriranje uredjaja prema lokaciji
    devices = db.query(models.Device).join(models.Location).filter(models.Location.id == location_id).all()
    return devices
@router.get("/devices/type/{device_type}")
def get_devices_by_type(device_type: str, db: Session = Depends(get_db)):
    # Filtriranje uredjaja prema tipu
    devices = db.query(models.Device).filter(models.Device.type == device_type).all()
    return devices
#SORTIRANJE UREDJAJA (prema tipu ili lokaciji)
# primer: GET /devices/list/?sort_by=device_type&sort_order=asc
@router.get("/list/", response_model=List[models.Device])
def list_devices(
    sort: str = Query('asc', enum=['asc', 'desc']),
    location_name: str = Query(None, alias="location_name"),
    db: Session = Depends(get_db)
):
    try:
        # Upit koji ukljucuje uređaje i njihove lokacije
        query = db.query(models.Device)
        if location_name:
            query = query.join(models.Location).filter(models.Location.name == location_name)
        # Sortiranje uredjaja prema device_type (ili drugom atributu)
        if sort == 'asc':
            devices = query.order_by(asc(models.Device.device_type)).all() 
        elif sort == 'desc':
            devices = query.order_by(desc(models.Device.device_type)).all() 
        return devices
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greska prilikom pronalazenja uredjaja: {str(e)}") from e'''

@router.get("/devices/all",response_model=schemas.UserResponse)
def get_all_devices(db: Session = Depends(get_db),
                    current_user: models.User = Depends(get_current_user)):
    return current_user