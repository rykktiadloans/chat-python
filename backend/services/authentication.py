from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from model.user import User
from services.jwt import get_username_from_token, user_to_token
from services.user_repository import get_user_by_username
from .encryption import hashed_equals

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")

incorrect_credentials = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect credentials"
)

def login_user(username: str, password: str):
    "Check if the user with specified credentials exists and return a corresponding token"
    user = get_user_by_username(username)
    if user == None:
        raise incorrect_credentials
    if not hashed_equals(password, user.password):
        raise incorrect_credentials
    return user_to_token(user)   

async def get_logged_in_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    "Get the user from the JWT token"
    username = get_username_from_token(token)
    user = get_user_by_username(username)
    if user == None:
        raise incorrect_credentials
    return user

