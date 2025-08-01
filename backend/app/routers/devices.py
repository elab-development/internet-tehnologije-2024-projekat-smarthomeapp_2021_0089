from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import get_db
import models
from sqlalchemy import asc, desc
from dependencies import get_current_user
import schemas
from fastapi.responses import StreamingResponse
import io
import csv
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


router = APIRouter(
    prefix="/devices",
    tags=["devices"]
)
"""
Kombinovana funkcija za paginaciju, filtriranje i sortiranje uredjaja
Parametri:
- page (int): Stranica rezultata, podrazumevano 1
- page_size (int): Broj rezultata po stranici, podrazumevano 10
- location_id (int): ID lokacije za filtriranje (opciono)
- device_type (str): Tip uredjaja za filtriranje (opciono)
- sort (str): Redosled sortiranja (asc ili desc), podrazumevano asc
"""
@router.get("/")
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
        # inicijalni upit
        user_locations = current_user.locations
        is_admin_or_owner = current_user.role.name in ["Admin", "Owner"]

        if is_admin_or_owner:
            query = db.query(models.Device)
        else:
            user_locations = current_user.locations
            if not user_locations:
                raise HTTPException(status_code=404, detail="No locations found for the user")
            query = db.query(models.Device).filter(
             models.Device.location_id.in_([loc.location_id for loc in user_locations])
            )

        # filtriranje prema lokaciji
        if location_id is not None:
            query = query.join(models.Location).filter(models.Location.location_id == location_id)
        # filtriranje prema tipu uredjaja
        if device_type is not None:
            query = query.filter(models.Device.device_type == device_type)
        # sortiranje prema tipu uredjaja
        if sort == "asc":
            query = query.order_by(asc(models.Device.device_type))
        elif sort == "desc":
            query = query.order_by(desc(models.Device.device_type))
        # paginacija
        offset = (page - 1) * page_size
        devices = query.offset(offset).limit(page_size).all()
         # ukupno pronadjenih uredjaja
        total_devices = query.count()

        devices_response = []
        for device in devices:
            location_name = device.location.name if device.location else "Unknown"
            devices_response.append(
                schemas.DeviceResponse(
                    device_id=device.device_id,
                    location_name=location_name,
                    device_type=device.device_type,
                    status=device.status,
                    temperature=getattr(device, "temperature", None),
                    brightness=getattr(device, "brightness", None),
                    color=getattr(device, "color", None),
                    air_quality=getattr(device,"air_quality",None),
                    fan_speed=getattr(device,"fan_speed",None)
                )
            )
        # vracanje rezultata
        return {"page": page, "page_size": page_size, "total_devices": total_devices, "data": devices_response} #vraca se JSON
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greska prilikom pronalazenja uredjaja: {str(e)}") from e
    
    #ako se vrati prazna lista znaci da nema podataka po zadatim filterima
    
# primer: Paginacija bez filtriranja:GET /devices/?page=1&page_size=5
#Filtriranje po lokaciji i paginacija:GET /devices/?location_id=2&page=1&page_size=5
#Sortiranje i filtriranje:GET /devices/?device_type=sensor&sort=desc&page=2&page_size=3

@router.post("/", status_code=201)
def create_device(
    device: schemas.DeviceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role.name not in ["Admin", "Owner"]:
        raise HTTPException(status_code=403, detail="Only Admin and Owner can create devices")

    model_map = {
        "device": models.Device,
        "thermostat": models.Thermostat,
        "lightbulb": models.LightBulb,
        "doorlock": models.DoorLock,
        "airpurifier": models.AirPurifier
    }

    model_class = model_map.get(device.device_type)
    if not model_class:
        raise HTTPException(status_code=400, detail="Invalid device_type")

    location = db.query(models.Location).filter(models.Location.name == device.location_name).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    device_data = device.model_dump(exclude_unset=True, exclude={"location_name"})

    device_data["location_id"] = location.location_id

    # Dodaju se default vrednosti
    if device.device_type == "thermostat":
        device_data.setdefault("status", "idle")
        device_data.setdefault("temperature", 22.0)
    elif device.device_type == "lightbulb":
        device_data.setdefault("status", "off")
        device_data.setdefault("brightness", 50.0)
        device_data.setdefault("color", "yellow")
    elif device.device_type == "doorlock":
        device_data.setdefault("status", "unlocked")
    elif device.device_type == "airpurifier":
        device_data.setdefault("status", "off")
        device_data.setdefault("fan_speed", 1)
        device_data.setdefault("air_quality", 0.0)  # npr. početna AQI vrednost

    new_device = model_class(**device_data)
    db.add(new_device)
    db.commit()
    db.refresh(new_device)

    return schemas.DeviceResponse(
        **new_device.__dict__,
        location_name=location.name
    )


@router.delete("/{device_id}", status_code=204)
def delete_device(device_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    device = db.query(models.Device).filter(models.Device.device_id == device_id).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    if current_user.role.name not in ["Admin", "Owner"]:
        # Regular korisnici samo uređaji na njihovim lokacijama
        if device.location_id not in [loc.location_id for loc in current_user.locations]:
            raise HTTPException(status_code=403, detail="You do not have access to delete this device")


    db.delete(device)
    db.commit()
    return


@router.put("/{device_id}")
def update_device(
    device_id: int,
    update_data: schemas.DeviceUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Pronalazim uređaj
    device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Proveravam da li korisnik ima pristup lokaciji uređaja
    if current_user.role.name not in ["Admin", "Owner"]:
        if device.location_id not in [loc.location_id for loc in current_user.locations]:
            raise HTTPException(status_code=403, detail="You do not have access to update this device")

    # Pretvaram update podatke u dict i uklanjam None vrednosti
    update_dict = update_data.model_dump(exclude_unset=True)

    for field, value in update_dict.items():
        setattr(device, field, value)

    db.commit()
    db.refresh(device)
    return {"detail": "Device updated successfully"}


#eksport podataka (uredjaji za datog korisnika)
@router.get("/export/")
def export_devices(
    format: str = Query(..., regex="^(csv|pdf)$"), #korisnik moze da bira samo ove formate
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # uzima uredjaje korisnika
    user_locations = current_user.locations
    if not user_locations:
        raise HTTPException(status_code=404, detail="No locations found for the user")

    devices = (
        db.query(models.Device)
        .filter(models.Device.location_id.in_([loc.location_id for loc in user_locations]))
        .all()
    )

    # Eksport u CSV
    if format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        # Zaglavlje
        writer.writerow(["device_id", "location_name", "device_type", "status", "temperature", "brightness", "color"])
        # Podaci
        for d in devices:
            writer.writerow([
                d.device_id,
                d.location.name if d.location else "Unknown",
                d.device_type,
                d.status,
                getattr(d, "temperature", ""), #ako uredjaj nema atribut temp, ostavlja prazno 
                getattr(d, "brightness", ""),
                getattr(d, "color", "")
            ])
        output.seek(0)
        return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=devices.csv"})
        #ovaj header browser prepoznaje kao fajl za preuzimanje
    

    # Eksport u PDF
    elif format == "pdf":
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter) #reportlab biblioteka kreira PDF canvas
        width, height = letter

        p.setFont("Helvetica", 12)
        y = height - 40
        p.drawString(40, y, "Devices Report")
        y -= 30

        for d in devices:
            line = f"ID: {d.device_id}, Type: {d.device_type}, Status: {d.status}, Location: {d.location.name if d.location else 'Unknown'}"
            if hasattr(d, "temperature") and d.temperature is not None:
                line += f", Temp: {d.temperature}"
            if hasattr(d, "brightness") and d.brightness is not None:
                line += f", Brightness: {d.brightness}"
            if hasattr(d, "color") and d.color is not None:
                line += f", Color: {d.color}"

            p.drawString(40, y, line)
            y -= 20
            if y < 40:
                p.showPage()
                y = height - 40

        p.save()
        buffer.seek(0)
        return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=devices.pdf"})

    else:
        raise HTTPException(status_code=400, detail="Unsupported format")
    

