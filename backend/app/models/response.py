from pydantic import BaseModel

from app.models.enums import RideCategory


class EstimateResult(BaseModel):
    provider: str
    normalized_category: RideCategory
    estimated_price: float
    eta_minutes: int
    redirect_url: str = ""
