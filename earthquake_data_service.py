# /// script
# requires-python = "==3.11.*"
# dependencies = [
#   "codewords-client==0.4.0",
#   "fastapi==0.116.1",
#   "httpx==0.28.1"
# ]
# [tool.env-checker]
# env_vars = [
#   "PORT=8000",
#   "LOGLEVEL=INFO",
#   "CODEWORDS_API_KEY",
#   "CODEWORDS_RUNTIME_URI"
# ]
# ///

from typing import Literal
import json
from datetime import datetime, timedelta

import httpx
from codewords_client import logger, run_service, redis_client
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


USGS_API_URLS = {
    "hour": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
    "day": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    "week": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
    "month": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
}

CACHE_TTL = 600  # 10 minutes


async def fetch_usgs_data(time_range: str) -> dict:
    """Fetch earthquake data from USGS API."""
    logger.info("STEPLOG START fetch_usgs")
    url = USGS_API_URLS.get(time_range)
    if not url:
        raise HTTPException(status_code=400, detail=f"Invalid time range: {time_range}")
    
    logger.info("Fetching earthquake data from USGS", time_range=time_range, url=url)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


async def get_cached_data(redis, ns: str, time_range: str) -> dict | None:
    """Retrieve cached earthquake data from Redis."""
    cache_key = f"{ns}:earthquakes:{time_range}"
    cached = await redis.get(cache_key)
    
    if cached:
        logger.info("Cache hit for earthquake data", time_range=time_range)
        return json.loads(cached)
    
    logger.info("Cache miss for earthquake data", time_range=time_range)
    return None


async def cache_data(redis, ns: str, time_range: str, data: dict) -> None:
    """Store earthquake data in Redis cache."""
    cache_key = f"{ns}:earthquakes:{time_range}"
    await redis.setex(cache_key, CACHE_TTL, json.dumps(data))
    logger.info("Cached earthquake data", time_range=time_range, ttl=CACHE_TTL)


def filter_earthquakes(geojson_data: dict, min_magnitude: float, max_results: int) -> list[dict]:
    """Filter and transform earthquake data."""
    logger.info("STEPLOG START filter_data")
    earthquakes = []
    
    for feature in geojson_data.get("features", []):
        props = feature.get("properties", {})
        coords = feature.get("geometry", {}).get("coordinates", [])
        
        magnitude = props.get("mag")
        if magnitude is None or magnitude < min_magnitude:
            continue
        
        earthquake = {
            "id": feature.get("id"),
            "magnitude": magnitude,
            "location": props.get("place", "Unknown location"),
            "latitude": coords[1] if len(coords) > 1 else None,
            "longitude": coords[0] if len(coords) > 0 else None,
            "depth": coords[2] if len(coords) > 2 else None,
            "time": datetime.fromtimestamp(props.get("time", 0) / 1000).isoformat() + "Z",
            "url": props.get("url", ""),
            "type": props.get("type", "earthquake")
        }
        earthquakes.append(earthquake)
    
    # Sort by magnitude (highest first) and limit results
    earthquakes.sort(key=lambda x: x["magnitude"], reverse=True)
    logger.info("Filtered earthquakes", total=len(earthquakes), returned=min(len(earthquakes), max_results), min_mag=min_magnitude)
    return earthquakes[:max_results]

# -------------------------
# FastAPI Application
# -------------------------
app = FastAPI(
    title="Earthquake Data Service",
    description="Fetches and filters earthquake data from USGS with Redis caching for frontend visualization.",
    version="1.0.0",
)

# Add CORS middleware to allow browser requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EarthquakeRequest(BaseModel):
    min_magnitude: float = Field(
        default=2.5,
        description="Minimum earthquake magnitude to include (0.0 - 10.0)",
        example=3.0,
        ge=0.0,
        le=10.0
    )
    max_results: int = Field(
        default=100,
        description="Maximum number of earthquakes to return",
        example=50,
        ge=1,
        le=500
    )
    time_range: Literal["hour", "day", "week", "month"] = Field(
        default="day",
        description="Time range for earthquake data",
        json_schema_extra={"enum": ["hour", "day", "week", "month"]}
    )

class Earthquake(BaseModel):
    id: str
    magnitude: float
    location: str
    latitude: float | None
    longitude: float | None
    depth: float | None
    time: str
    url: str
    type: str


class EarthquakeResponse(BaseModel):
    earthquakes: list[Earthquake] = Field(..., description="List of filtered earthquakes")
    total_count: int = Field(..., description="Total number of earthquakes matching filters")
    fetched_at: str = Field(..., description="Timestamp when data was fetched")
    time_range: str = Field(..., description="Time range of the data")
    min_magnitude: float = Field(..., description="Minimum magnitude filter applied")
    cached: bool = Field(..., description="Whether data was served from cache")

@app.post("/", response_model=EarthquakeResponse)
async def get_earthquake_data(request: EarthquakeRequest):
    """
    Fetch and filter earthquake data from USGS with Redis caching.

    - **min_magnitude**: Minimum magnitude to include (default: 2.5)
    - **max_results**: Maximum earthquakes to return (default: 100)
    - **time_range**: Data timeframe - hour, day, week, or month (default: day)

    Returns filtered earthquake data with location, magnitude, time, and coordinates.
    Data is cached for 10 minutes to improve performance and reduce API calls.
    """
    logger.info(
        "Processing earthquake data request",
        min_magnitude=request.min_magnitude,
        max_results=request.max_results,
        time_range=request.time_range
    )
    
    cached = False
    geojson_data = None
    
    # Try to get cached data
    async with redis_client() as (redis, ns):
        logger.info("STEPLOG START check_cache")
        geojson_data = await get_cached_data(redis, ns, request.time_range)
        
        if not geojson_data:
            # Fetch fresh data from USGS
            geojson_data = await fetch_usgs_data(request.time_range)
            # Cache it for next time
            await cache_data(redis, ns, request.time_range, geojson_data)
        else:
            cached = True
    
    # Filter earthquakes based on criteria
    earthquakes = filter_earthquakes(
        geojson_data,
        request.min_magnitude,
        request.max_results
    )
    
    logger.info("STEPLOG START return_json")
    return EarthquakeResponse(
        earthquakes=earthquakes,
        total_count=len(earthquakes),
        fetched_at=datetime.utcnow().isoformat() + "Z",
        time_range=request.time_range,
        min_magnitude=request.min_magnitude,
        cached=cached
    )

if __name__ == "__main__":
    run_service(app)