from app.models.response import EstimateResult


def rank_estimates(estimates: list[EstimateResult]) -> list[EstimateResult]:
    return sorted(
        estimates,
        key=lambda e: (e.estimated_price, e.eta_minutes),
    )
