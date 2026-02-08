import pytest

from app.adapters.uber_mock import UberMockAdapter
from app.adapters.lyft_mock import LyftMockAdapter
from app.models.enums import RideCategory
from app.models.request import CompareRequest

pytestmark = pytest.mark.asyncio

SAMPLE_REQUEST = CompareRequest(
    pickup_lat=37.7749,
    pickup_lng=-122.4194,
    drop_lat=37.3382,
    drop_lng=-121.8863,
    category=RideCategory.STANDARD,
)


async def test_uber_mock_returns_estimate():
    adapter = UberMockAdapter()
    results = await adapter.get_estimates(SAMPLE_REQUEST)
    # May be empty due to 5% failure rate; run a few times
    # For testing determinism, we accept 0 or 1 results
    assert isinstance(results, list)
    if results:
        assert results[0].provider == "Uber"
        assert results[0].normalized_category == RideCategory.STANDARD


async def test_lyft_mock_returns_estimate():
    adapter = LyftMockAdapter()
    results = await adapter.get_estimates(SAMPLE_REQUEST)
    assert isinstance(results, list)
    if results:
        assert results[0].provider == "Lyft"
        assert results[0].normalized_category == RideCategory.STANDARD


async def test_uber_mock_price_reasonable():
    adapter = UberMockAdapter()
    for _ in range(20):
        results = await adapter.get_estimates(SAMPLE_REQUEST)
        if results:
            price = results[0].estimated_price
            # Base range $12-28 * distance factor 0.5-2.0
            assert 5.0 <= price <= 60.0, f"Unexpected price: {price}"


async def test_lyft_mock_price_reasonable():
    adapter = LyftMockAdapter()
    for _ in range(20):
        results = await adapter.get_estimates(SAMPLE_REQUEST)
        if results:
            price = results[0].estimated_price
            # Base range $10-26 * distance factor 0.5-2.0
            assert 4.0 <= price <= 55.0, f"Unexpected price: {price}"


async def test_distance_factor_scaling():
    adapter = UberMockAdapter()
    short_factor = adapter._estimate_distance_factor(37.77, -122.41, 37.78, -122.42)
    long_factor = adapter._estimate_distance_factor(37.77, -122.41, 38.77, -121.41)
    assert long_factor > short_factor
