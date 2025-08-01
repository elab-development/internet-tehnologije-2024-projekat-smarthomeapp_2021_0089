from fastapi import FastAPI
from routers import users
from routers import devices
from routers import locations
from routers import weather_api
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.include_router(users.router)
app.include_router(devices.router)
app.include_router(locations.router)
app.include_router(weather_api.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  #url react aplikacije
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "hey girlie"}