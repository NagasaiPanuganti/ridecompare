from enum import Enum


class RideCategory(str, Enum):
    STANDARD = "Standard"
    XL = "XL"
    PREMIUM = "Premium"
