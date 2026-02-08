import pytest

pytestmark = pytest.mark.asyncio


async def test_health_endpoint(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_compare_returns_200_with_valid_request(client):
    body = {
        "pickup_lat": 37.7749,
        "pickup_lng": -122.4194,
        "drop_lat": 37.3382,
        "drop_lng": -121.8863,
        "category": "Standard",
    }
    response = await client.post("/compare", json=body)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


async def test_compare_results_sorted_by_price(client):
    body = {
        "pickup_lat": 37.7749,
        "pickup_lng": -122.4194,
        "drop_lat": 37.3382,
        "drop_lng": -121.8863,
        "category": "Standard",
    }
    response = await client.post("/compare", json=body)
    data = response.json()
    if len(data) >= 2:
        prices = [r["estimated_price"] for r in data]
        assert prices == sorted(prices)


async def test_compare_results_have_redirect_urls(client):
    body = {
        "pickup_lat": 37.7749,
        "pickup_lng": -122.4194,
        "drop_lat": 37.3382,
        "drop_lng": -121.8863,
        "category": "Standard",
    }
    response = await client.post("/compare", json=body)
    data = response.json()
    for result in data:
        assert result["redirect_url"] != ""


async def test_compare_rejects_invalid_latitude(client):
    body = {
        "pickup_lat": 999,
        "pickup_lng": -122.4194,
        "drop_lat": 37.3382,
        "drop_lng": -121.8863,
        "category": "Standard",
    }
    response = await client.post("/compare", json=body)
    assert response.status_code == 422


async def test_compare_rejects_unknown_category(client):
    body = {
        "pickup_lat": 37.7749,
        "pickup_lng": -122.4194,
        "drop_lat": 37.3382,
        "drop_lng": -121.8863,
        "category": "Helicopter",
    }
    response = await client.post("/compare", json=body)
    assert response.status_code == 422


async def test_compare_handles_all_categories(client):
    for category in ["Standard", "XL", "Premium"]:
        body = {
            "pickup_lat": 37.7749,
            "pickup_lng": -122.4194,
            "drop_lat": 37.3382,
            "drop_lng": -121.8863,
            "category": category,
        }
        response = await client.post("/compare", json=body)
        assert response.status_code == 200
        data = response.json()
        for result in data:
            assert result["normalized_category"] == category
