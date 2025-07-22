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
from dependencies import get_current_user
from typing import List
from fastapi import Body

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)



@router.get("/")
def read_users():
    return [{"username": "Sponge"}, {"username": "Bob"}]

#vraca sve role
@router.get("/roles", response_model=List[schemas.Role])
def get_all_roles(db: Session = Depends(get_db)):
    roles = db.query(models.Role).all()
    return roles

@router.get("/me", response_model=schemas.UserResponse)
def get_logged_in_user(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")
    return current_user

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
        "email": user.mail,
        "role": user.role.name
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

# vraca sve sobe za datog korisnika
@router.get("/{user_id}/locations", response_model=List[schemas.Location])
def get_user_locations(
    user_id: int,
    db: Session = Depends(get_db),
    #admin: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role.name in ["Admin", "Owner"]:
        # Vrati sve sobe ako je korisnik admin ili owner
        all_locations = db.query(models.Location).all()
        return all_locations
    else:
        # Vrati samo sobe koje su povezane sa korisnikom
        return user.locations
    

#promena role korisnika od strane admina
@router.put("/{user_id}/role")
def update_user_role(
    user_id: int,
    role_id: int,  # 1 = Admin, 2 = Regular, 3 = Owner
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = db.query(models.Role).filter(models.Role.role_id == role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role ID")

    if user.role_id == role.role_id:
        return {
            "message": f"User {user.mail} already has the '{role.name}' role",
            "no_change": True
        }

    user.role_id = role.role_id
    db.commit()
    db.refresh(user)

    return {"message": f"Changed role for user {user.mail} to '{role.name}'"}



#dodeljivanje soba korisniku od strane admina
@router.put("/{user_id}/locations")
def add_locations_to_user(
    user_id: int,
    location_ids: List[int],
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    valid_locations = db.query(models.Location).filter(models.Location.location_id.in_(location_ids)).all()

    if len(valid_locations) != len(set(location_ids)):
        raise HTTPException(status_code=400, detail="Invalid locations")

    #dodaje samo one sobe koje korisnik nema
    current_location_ids = {loc.location_id for loc in user.locations}
    new_locations = [loc for loc in valid_locations if loc.location_id not in current_location_ids]

    if not new_locations:
        return {"message": "User already has access to these locations"}

    user.locations.extend(new_locations)
    db.commit()
    db.refresh(user)

    return {"message": f"Added {len(new_locations)} new locations to user {user.mail}"}


#uklanjanje pristupa sobama korisnika od strane admina
@router.delete("/{user_id}/locations")
def remove_locations_from_user(
    user_id: int,
    location_ids: List[int] = Body(..., embed=True),  #{ "location_ids": [1, 2, 3] }
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    #filtriranje korisnikovih trenutnih soba koje se poklapaju sa sobama za brisanje
    locations_to_remove = [
        loc for loc in user.locations if loc.location_id in location_ids
    ]

    if not locations_to_remove:
        raise HTTPException(status_code=404, detail="User does not have access to these locations")

    for loc in locations_to_remove:
        user.locations.remove(loc)

    db.commit()
    db.refresh(user)

    return {"message": f"Deleted access to {len(locations_to_remove)} locations for user {user.mail}"}





