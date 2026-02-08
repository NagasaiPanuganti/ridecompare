from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RideCompare API"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000"]
    uber_api_key: str = ""
    lyft_api_key: str = ""
    adapter_timeout_seconds: float = 2.5

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
