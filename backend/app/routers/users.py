from fastapi import APIRouter, Depends, HTTPException, status
from db import get_db
import models,schemas,utils
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from settings import ALGORITHM, SECRET_KEY
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from typing import List
from dependencies import require_admin


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


#LOGIN KORISNIKA

@router.post("/login", response_model=schemas.TokenResponse)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Korisnika tražimo u bazi na osnovu email-a
    user = db.query(models.User).filter(models.User.mail == form_data.username).first()

    # Ako korisnik nije pronađen, vraćamo grešku
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Uneli ste nepostojeci mail",
        )

    # Proveravamo da li je uneta lozinka ispravna
    if not utils.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Lozinka nije ispravna",
        )

    # Generišemo JWT token za autentifikaciju
    access_token = utils.create_access_token(data={"user_id": user.user_id})

    # Vraćamo token korisniku
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "name": user.name,
        "last_name": user.lastname,
        "email": user.mail
    }



#LOGOUT KORISNIKA
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/logout")
def logout_user(token: str = Depends(oauth2_scheme)):
    # Samo vraćamo poruku korisniku
    return {"message": "Logout successful"}


#Promena lozinke u slucaju da je korisnik zaboravi

@router.post("/reset-password")
def reset_password(data: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    # Pronađi korisnika po email adresi
    user = db.query(models.User).filter(models.User.mail == data.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Heširaj novu lozinku i sačuvaj
    hashed_new_password = utils.hash(data.new_password)
    user.password = hashed_new_password

    db.commit()
    return {"message": "Lozinka je uspesno promenjena."}

