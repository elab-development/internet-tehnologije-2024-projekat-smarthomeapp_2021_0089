
from pydantic import BaseModel, EmailStr,ConfigDict
from typing import Optional, Literal, Union



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
    name: str
    last_name: str
    email: str


class DeviceResponse(BaseModel):
    device_id: int
    location_name: str
    device_type: str
    status: str
    temperature: Optional[float] = None  # Opcionalno, može biti None
    brightness: Optional[float] = None  # Opcionalno, može biti None
    color: Optional[str] = None  # Opcionalno, može biti None


class BaseDeviceCreate(BaseModel):
    location_name: str
    status: Optional[str] = None
    temperature: Optional[float] = None
    device_type: Literal["device", "thermostat", "lightbulb", "doorlock", "oven", "airpurifier"]

class ThermostatCreate(BaseDeviceCreate):
    device_type: Literal["thermostat"]

class LightBulbCreate(BaseDeviceCreate):
    device_type: Literal["lightbulb"]
    brightness: Optional[float] = None
    color: Optional[str] = None 

class DoorLockCreate(BaseDeviceCreate):
    device_type: Literal["doorlock"]

class OvenCreate(BaseDeviceCreate):
    device_type: Literal["oven"]

class AirPurifierCreate(BaseDeviceCreate):
    device_type: Literal["airpurifier"]
    air_quality: Optional[float] = None
    fan_speed: Optional[int] = None


DeviceCreate = Union[ThermostatCreate, LightBulbCreate, DoorLockCreate, OvenCreate, AirPurifierCreate, BaseDeviceCreate]


class DeviceUpdate(BaseModel):
    status: Optional[str] = None
    temperature: Optional[float] = None
    brightness: Optional[float] = None
    color: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str

class Location(BaseModel):
    location_id: int
    name: str

    model_config = ConfigDict(from_attributes=True)