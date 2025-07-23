from fastapi import APIRouter, Depends, HTTPException, status
from db import get_db
import models,schemas,utils
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from typing import List
from dependencies import require_admin
from dependencies import get_current_user
from typing import List
from sqlalchemy.orm import joinedload

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)



@router.get("/", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db), admin_user: models.User = Depends(require_admin)):
    users = db.query(models.User)\
        .options(joinedload(models.User.role), joinedload(models.User.locations))\
        .all()
    return users


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

    existing_user = db.query(models.User).filter(models.User.mail == user.mail).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
   
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



@router.put("/{user_id}/role", status_code=status.HTTP_200_OK)
def update_user_role(
    user_id: int,
    request: schemas.UpdateUserRoleRequest, # 1 = Admin, 2 = Regular, 3 = Owner
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = db.query(models.Role).filter(models.Role.role_id == request.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role ID")

    if user.role_id == role.role_id:
        return {"message": f"User already has role '{role.name}'", "no_change": True}

    user.role_id = role.role_id
    db.commit()
    db.refresh(user)
    return {"message": f"User role updated to '{role.name}'"}

@router.put("/{user_id}/locations", status_code=status.HTTP_200_OK)
def update_user_locations(
    user_id: int,
    request: schemas.UpdateUserLocationsRequest,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    valid_locations = db.query(models.Location).filter(models.Location.location_id.in_(request.location_ids)).all()
    if len(valid_locations) != len(set(request.location_ids)):
        raise HTTPException(status_code=400, detail="One or more location IDs are invalid")

    # Replace all locations
    user.locations = valid_locations
    db.commit()
    db.refresh(user)
    return {"message": f"User locations updated. Now has access to {len(valid_locations)} locations"}





