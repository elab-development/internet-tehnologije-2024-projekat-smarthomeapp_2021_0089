# app/routes/weather.py
from fastapi import APIRouter, Query
import requests
from settings import settings

router = APIRouter()

@router.get("/api/weather")
def get_weather(city: str = Query(...)):
    url = "https://api.weatherapi.com/v1/forecast.json"
    params = {
        "key": settings.WEATHER_API_KEY,
        "q": city,
        "days": 3,
        "aqi": "yes"
    }

    response = requests.get(url, params=params)
    print(response.json())
    return response.json()
