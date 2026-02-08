from abc import ABC, abstractmethod

from app.models.request import CompareRequest
from app.models.response import EstimateResult


class ProviderAdapter(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Human-readable provider name (e.g., 'Uber', 'Lyft')."""
        ...

    @abstractmethod
    async def get_estimates(self, request: CompareRequest) -> list[EstimateResult]:
        """
        Fetch estimates from this provider.
        Returns a list of EstimateResult (empty list on failure).
        Must NOT raise exceptions — return empty list on error for graceful degradation.
        """
        ...
