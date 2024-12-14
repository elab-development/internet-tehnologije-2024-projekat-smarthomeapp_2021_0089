from passlib.context import CryptContext
import app.settings as settings



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def hash(password: str):
    return pwd_context.hash(password)

def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

#funkcija za generisanje tokena
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
# parametri za generisanje i validaciju JWT (JSON Web Token)
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: timedelta = None): 
    #data:dict ocekuje recnik sa podacima koji treba da budu sadrzani u tokenu, najcesce user_id
    #timedelta = None opciono vreme isteka tokena, ako nije prosledjeno koristi se nasa konstanta

    to_encode = data.copy() #pravi se kopija prosledjenih podataka kako se ne bi ugrozili originalni
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta  #koristi se vreme koje je korisnik prosledio
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) #koristi se nase vreme
    to_encode.update({"exp": expire}) #dodaje se kljuc u recnik (vreme isteka tokena)
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) #generisanje JWT tokena uz pomoc jose bibl.
    return encoded_jwt