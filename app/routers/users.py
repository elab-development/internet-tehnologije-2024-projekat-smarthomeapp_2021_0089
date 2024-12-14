from fastapi import APIRouter, Depends, HTTPException, status
from app.db import get_db
import app.models as models
import app.schemas as schemas
import app.utils as utils
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


#LOGIN KORISNIKA
from fastapi.security import OAuth2PasswordRequestForm #klasa koja pomaze u citanju i koriscenju podataka za login

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
    return {"access_token": access_token, "token_type": "bearer"}

