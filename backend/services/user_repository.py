from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from model.user import User
from services.encryption import hashify

def get_user_by_username(username: str) -> User | None:
    "Get a user by their username. If nothing is found, return None."
    if username == "username":
        return User(username="username", id=1, password=hashify("password"))
    return None
