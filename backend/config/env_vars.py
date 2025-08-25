from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    "Environment variables"
    secret_key: str
    hash_algorithm: str
    expiration_minutes: int

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
