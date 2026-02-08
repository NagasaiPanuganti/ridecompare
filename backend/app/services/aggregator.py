import asyncio
import logging

from app.adapters.base import ProviderAdapter
from app.adapters.registry import get_active_adapters
from app.config import settings
from app.models.request import CompareRequest
from app.models.response import EstimateResult

logger = logging.getLogger(__name__)


async def _fetch_with_timeout(
    adapter: ProviderAdapter, request: CompareRequest
) -> list[EstimateResult]:
    try:
        return await asyncio.wait_for(
            adapter.get_estimates(request),
            timeout=settings.adapter_timeout_seconds,
        )
    except asyncio.TimeoutError:
        logger.warning("Adapter %s timed out", adapter.provider_name)
        return []
    except Exception as e:
        logger.error("Adapter %s failed: %s", adapter.provider_name, e)
        return []


async def aggregate_estimates(request: CompareRequest) -> list[EstimateResult]:
    adapters = get_active_adapters()
    results = await asyncio.gather(
        *(_fetch_with_timeout(adapter, request) for adapter in adapters)
    )
    all_estimates: list[EstimateResult] = []
    for result in results:
        all_estimates.extend(result)
    return all_estimates
