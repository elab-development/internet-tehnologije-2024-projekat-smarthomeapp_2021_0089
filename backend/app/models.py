from sqlalchemy import Column, Integer, String, ForeignKey, Float, Table
from sqlalchemy.orm import relationship,declarative_base


Base=declarative_base()

user_location = Table(
    'user_location', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.user_id'), primary_key=True),
    Column('location_id', Integer, ForeignKey('locations.location_id'), primary_key=True)
)


class User(Base):
    __tablename__='users'
    user_id: int = Column(Integer,primary_key=True,index=True,nullable=False)
    name: str=Column(String(80),nullable=False)
    lastname: str=Column(String(80),nullable=False)
    mail: str=Column(String(80),nullable=False,unique=True)
    password: str=Column(String(80),nullable=False)
    role_id: int=Column(Integer, ForeignKey("roles.role_id", ondelete="CASCADE"), nullable=False)
    role=relationship("Role")
    locations = relationship('Location', secondary=user_location, back_populates='users')


class Role(Base):
    __tablename__ = 'roles'
    role_id: int = Column(Integer, primary_key=True, nullable=False)
    name: str = Column(String(80), nullable=False)
    description:  str = Column(String(80), nullable=False)

class Device(Base):
    __tablename__ = 'devices'
    device_id: int = Column(Integer, primary_key=True,nullable=False)
    location_id: int = Column(Integer,ForeignKey("locations.location_id",ondelete="CASCADE"),nullable=False)
    status: str=Column(String(80))
    temperature: float =Column(Float)
    device_type: str = Column(String(80))  # kolona za razlikovanje podkalasa
    __mapper_args__ = {
        'polymorphic_identity': 'device', 
        'polymorphic_on': device_type    
    }
    location=relationship("Location")

class Location(Base):
    __tablename__='locations'
    location_id: int= Column(Integer, primary_key=True, index=True)
    name: str= Column(String(80),nullable=False)
    users = relationship('User', secondary=user_location, back_populates='locations')



class Thermostat(Device):
    __mapper_args__ = {'polymorphic_identity': 'thermostat'}  # identifikator podklase
    #temperature: float =Column(Float)
    #status: str=Column(String) #heating,cooling,idle

class LightBulb(Device):
    __mapper_args__ = {'polymorphic_identity': 'lightbulb'}  
    brightness: float= Column(Float)
    color: str=Column(String(80)) #red,purple,yellow,white,green,blue
    #status: str=Column(String) #on,off

class DoorLock(Device):
    __mapper_args__ = {'polymorphic_identity': 'doorlock'} 
    #status: str=Column(String) #locked,unlocked

class Oven(Device):
    __mapper_args__ = {'polymorphic_identity': 'oven'}
    # temperature: float =Column(Float)

class AirPurifier(Device):
    __mapper_args__ = {'polymorphic_identity': 'airpurifier'}
    #status: str=Column(String) #on,off
    air_quality: float = Column(Float)  # Optional: Air quality metric
    fan_speed: int = Column(Integer) # 1 = low, 2 = medium, 3 = high


