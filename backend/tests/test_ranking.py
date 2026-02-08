from app.models.enums import RideCategory
from app.models.response import EstimateResult
from app.services.ranking import rank_estimates


def _make_estimate(price: float, eta: int, provider: str = "Test") -> EstimateResult:
    return EstimateResult(
        provider=provider,
        normalized_category=RideCategory.STANDARD,
        estimated_price=price,
        eta_minutes=eta,
        redirect_url="https://example.com",
    )


def test_rank_by_price_ascending():
    estimates = [
        _make_estimate(25.0, 5),
        _make_estimate(15.0, 3),
        _make_estimate(20.0, 4),
    ]
    ranked = rank_estimates(estimates)
    prices = [e.estimated_price for e in ranked]
    assert prices == [15.0, 20.0, 25.0]


def test_rank_by_eta_on_price_tie():
    estimates = [
        _make_estimate(20.0, 10),
        _make_estimate(20.0, 5),
    ]
    ranked = rank_estimates(estimates)
    etas = [e.eta_minutes for e in ranked]
    assert etas == [5, 10]


def test_rank_empty_list():
    assert rank_estimates([]) == []


def test_rank_single_estimate():
    estimates = [_make_estimate(15.0, 3)]
    ranked = rank_estimates(estimates)
    assert len(ranked) == 1
    assert ranked[0].estimated_price == 15.0
