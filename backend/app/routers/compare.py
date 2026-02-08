from fastapi import APIRouter

from app.models.request import CompareRequest
from app.models.response import EstimateResult
from app.services.aggregator import aggregate_estimates
from app.services.ranking import rank_estimates
from app.services.redirect import attach_redirect_urls

router = APIRouter()


@router.post("/compare", response_model=list[EstimateResult])
async def compare_rides(request: CompareRequest) -> list[EstimateResult]:
    estimates = await aggregate_estimates(request)
    estimates = attach_redirect_urls(estimates, request)
    ranked = rank_estimates(estimates)
    return ranked
