import asyncio
import random

from app.adapters.base import ProviderAdapter
from app.models.enums import RideCategory
from app.models.request import CompareRequest
from app.models.response import EstimateResult

LYFT_PRICE_RANGES: dict[RideCategory, tuple[float, float]] = {
    RideCategory.STANDARD: (10.0, 26.0),
    RideCategory.XL: (16.0, 40.0),
    RideCategory.PREMIUM: (32.0, 70.0),
}

LYFT_ETA_RANGES: dict[RideCategory, tuple[int, int]] = {
    RideCategory.STANDARD: (2, 7),
    RideCategory.XL: (6, 14),
    RideCategory.PREMIUM: (8, 18),
}


class LyftMockAdapter(ProviderAdapter):
    @property
    def provider_name(self) -> str:
        return "Lyft"

    async def get_estimates(self, request: CompareRequest) -> list[EstimateResult]:
        try:
            # Simulate network latency
            await asyncio.sleep(random.uniform(0.2, 0.8))

            # Simulate occasional failures (~5%)
            if random.random() < 0.05:
                raise ConnectionError("Simulated Lyft API timeout")

            category = request.category
            price_min, price_max = LYFT_PRICE_RANGES[category]
            eta_min, eta_max = LYFT_ETA_RANGES[category]

            distance_factor = self._estimate_distance_factor(
                request.pickup_lat, request.pickup_lng,
                request.drop_lat, request.drop_lng,
            )

            price = round(random.uniform(price_min, price_max) * distance_factor, 2)
            eta = random.randint(eta_min, eta_max)

            return [
                EstimateResult(
                    provider=self.provider_name,
                    normalized_category=category,
                    estimated_price=price,
                    eta_minutes=eta,
                )
            ]
        except Exception:
            return []

    @staticmethod
    def _estimate_distance_factor(
        pickup_lat: float, pickup_lng: float,
        drop_lat: float, drop_lng: float,
    ) -> float:
        lat_diff = abs(drop_lat - pickup_lat)
        lng_diff = abs(drop_lng - pickup_lng)
        raw_distance = (lat_diff**2 + lng_diff**2) ** 0.5
        return max(0.5, min(2.0, raw_distance * 50))
