from app.adapters.base import ProviderAdapter
from app.adapters.lyft_mock import LyftMockAdapter
from app.adapters.uber_mock import UberMockAdapter


def get_active_adapters() -> list[ProviderAdapter]:
    return [
        UberMockAdapter(),
        LyftMockAdapter(),
    ]
