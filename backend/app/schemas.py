
from pydantic import BaseModel, EmailStr,ConfigDict
from typing import Optional, Literal, Union, List



class UserCreate(BaseModel):
    mail: EmailStr
    password: str
    name: str
    lastname:str

class Role(BaseModel):
    role_id: int
    name: str

class Location(BaseModel):
    location_id: int
    name: str

class UserResponse(BaseModel):
    user_id: int
    name: str
    lastname: str
    mail: str
    role_id: int
    role: Optional[Role]
    locations: List[Location] = []

#LOGIN KORISNIKA
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    name: str
    last_name: str
    email: str
    role: str


class DeviceResponse(BaseModel):
    device_id: int
    location_name: str
    device_type: str
    status: str
    temperature: Optional[float] = None  # Opcionalno, može biti None
    brightness: Optional[float] = None  # Opcionalno, može biti None
    color: Optional[str] = None  # Opcionalno, može biti None
    air_quality: Optional[float] = None
    fan_speed: Optional[int] = None


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
    air_quality: Optional[float] = None
    fan_speed: Optional[int] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str

class Location(BaseModel):
    location_id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class Role(BaseModel):
    role_id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)

class UpdateUserRoleRequest(BaseModel):
    role_id: int

class UpdateUserLocationsRequest(BaseModel):
    location_ids: List[int]