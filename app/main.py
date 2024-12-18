from fastapi import FastAPI
from routers import users
from routers import files
from routers import devices

app = FastAPI()

app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "hey girlie"}