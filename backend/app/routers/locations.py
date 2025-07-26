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