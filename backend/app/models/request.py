from pydantic import BaseModel, Field

from app.models.enums import RideCategory


class CompareRequest(BaseModel):
    pickup_lat: float = Field(..., ge=-90, le=90)
    pickup_lng: float = Field(..., ge=-180, le=180)
    drop_lat: float = Field(..., ge=-90, le=90)
    drop_lng: float = Field(..., ge=-180, le=180)
    category: RideCategory
