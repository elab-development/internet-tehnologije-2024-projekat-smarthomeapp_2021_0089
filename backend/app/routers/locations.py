from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
import models, schemas
from typing import List
from dependencies import get_current_user

router = APIRouter(
    prefix="/locations",
    tags=["locations"]
)

@router.get("/", response_model=List[schemas.Location])
def get_all_locations(db: Session = Depends(get_db)):
    return db.query(models.Location).all()

@router.get("/{location_id}/devices", response_model=List[schemas.DeviceResponse])
def get_devices_by_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    location = db.query(models.Location).filter(models.Location.location_id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    if location not in current_user.locations:
        raise HTTPException(status_code=403, detail="Access denied")

    devices = db.query(models.Device).filter(models.Device.location_id == location_id).all()

    return [
        schemas.DeviceResponse(
            device_id=d.device_id,
            location_name=location.name,
            device_type=d.device_type,
            status=d.status,
            temperature=getattr(d, "temperature", None),
            brightness=getattr(d, "brightness", None),
            color=getattr(d, "color", None),
        ) for d in devices
    ]