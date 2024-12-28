
from pydantic import BaseModel, EmailStr,ConfigDict



class UserCreate(BaseModel):
    mail: EmailStr
    password: str
    name: str
    lastname:str

class UserResponse(BaseModel):
    mail: EmailStr
    user_id: int
    name: str
    lastname: str

    model_config = ConfigDict(arbitrary_types_allowed=True)

#LOGIN KORISNIKA
class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class DeviceResponse(BaseModel):
    device_id: int
    location_name: str
    device_type: str
    status: str
    temperature: float = None  # Opcionalno, jer ne svi uređaji imaju temperaturu
    brightness: float = None
    color: str = None