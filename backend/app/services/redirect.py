from urllib.parse import urlencode

from app.models.request import CompareRequest
from app.models.response import EstimateResult


def _build_uber_url(request: CompareRequest) -> str:
    params = urlencode({
        "action": "setPickup",
        "pickup[latitude]": request.pickup_lat,
        "pickup[longitude]": request.pickup_lng,
        "dropoff[latitude]": request.drop_lat,
        "dropoff[longitude]": request.drop_lng,
    })
    return f"https://m.uber.com/ul/?{params}"


def _build_lyft_url(request: CompareRequest) -> str:
    params = urlencode({
        "pickup[latitude]": request.pickup_lat,
        "pickup[longitude]": request.pickup_lng,
        "destination[latitude]": request.drop_lat,
        "destination[longitude]": request.drop_lng,
    })
    return f"https://lyft.com/ride?{params}"


_URL_BUILDERS: dict[str, callable] = {
    "Uber": _build_uber_url,
    "Lyft": _build_lyft_url,
}


def attach_redirect_urls(
    estimates: list[EstimateResult], request: CompareRequest
) -> list[EstimateResult]:
    for estimate in estimates:
        builder = _URL_BUILDERS.get(estimate.provider)
        if builder:
            estimate.redirect_url = builder(request)
    return estimates
