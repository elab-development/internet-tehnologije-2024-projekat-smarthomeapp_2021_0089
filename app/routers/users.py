from fastapi import APIRouter, Depends, HTTPException, status
from db import get_db
import models,schemas,utils
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def read_users():
    return [{"username": "Sponge"}, {"username": "Bob"}]

@router.get("/{id}", response_model= schemas.UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No User Found")
    
    return user

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)  # register user
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
   
    hashed_password = utils.hash(user.password)
    user.password = hashed_password

   
    new_user = models.User(
        name=user.name,
        lastname=user.lastname,
        mail=user.mail,
        password=user.password,
        role_id=2 #default user koji vidi uredjaje u glavnim prostorijama i moze ih apdejtovati
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    default_locations = db.query(models.Location).filter(models.Location.location_id.in_([1, 2])).all()
    new_user.locations.extend(default_locations)

    db.commit()
    db.refresh(new_user)
    return new_user

