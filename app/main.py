from fastapi import FastAPI
from app.routers import users
from app.routers import devices
from app.routers import files

app = FastAPI()

app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "hey girlie"}