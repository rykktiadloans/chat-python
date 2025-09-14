from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Depends, HTTPException, status
import jwt
from pydantic import BaseModel
from config.env_vars import settings
from model.user import User


def create_token(payload: dict) -> str:
    "Takes in a payload and turns it into a JWT token"
    data = payload.copy()
    data.update({"exp": datetime.now(timezone.utc) +
                timedelta(settings.expiration_minutes)})
    return jwt.encode(data, settings.secret_key, settings.hash_algorithm)


def user_to_token(user: User) -> str:
    "Turn a user into a token"
    return create_token({
        "sub": str(user.id),
        "iat": datetime.now(timezone.utc)
    })


def get_user_id_from_token(token: str) -> int:
    "Decode the JWT token and extract the user ID from it"
    try:
        payload = jwt.decode(token, settings.secret_key,
                             settings.hash_algorithm)
        id = str(payload.get("sub"))
        if id == None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not get the username from the payload"
            )
    except (jwt.InvalidTokenError, jwt.DecodeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bad token"
        )
    return int(id)
