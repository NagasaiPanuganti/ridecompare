from app.models.enums import RideCategory
from app.models.request import CompareRequest
from app.models.response import EstimateResult
from app.services.redirect import attach_redirect_urls

SAMPLE_REQUEST = CompareRequest(
    pickup_lat=37.7749,
    pickup_lng=-122.4194,
    drop_lat=37.3382,
    drop_lng=-121.8863,
    category=RideCategory.STANDARD,
)


def test_uber_redirect_url_format():
    estimates = [
        EstimateResult(
            provider="Uber",
            normalized_category=RideCategory.STANDARD,
            estimated_price=20.0,
            eta_minutes=5,
        )
    ]
    attach_redirect_urls(estimates, SAMPLE_REQUEST)
    url = estimates[0].redirect_url
    assert url.startswith("https://m.uber.com/ul/")
    assert "37.7749" in url
    assert "-122.4194" in url
    assert "37.3382" in url
    assert "-121.8863" in url
    # Verify nickname/formatted_address params are present (required for pin display)
    assert "nickname" in url
    assert "formatted_address" in url


def test_lyft_redirect_url_format():
    estimates = [
        EstimateResult(
            provider="Lyft",
            normalized_category=RideCategory.STANDARD,
            estimated_price=18.0,
            eta_minutes=4,
        )
    ]
    attach_redirect_urls(estimates, SAMPLE_REQUEST)
    url = estimates[0].redirect_url
    assert url.startswith("https://lyft.com/ride")
    assert "37.7749" in url
    assert "-122.4194" in url
    assert "id=lyft" in url


def test_unknown_provider_keeps_empty_url():
    estimates = [
        EstimateResult(
            provider="Unknown",
            normalized_category=RideCategory.STANDARD,
            estimated_price=15.0,
            eta_minutes=3,
        )
    ]
    attach_redirect_urls(estimates, SAMPLE_REQUEST)
    assert estimates[0].redirect_url == ""
