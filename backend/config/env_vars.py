from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    "Environment variables"
    secret_key: str
    hash_algorithm: str
    expiration_minutes: int
    db_name: str
    db_user: str
    db_password: str
    db_url: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
