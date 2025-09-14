from typing import Annotated
from fastapi import Body, Depends, status
from fastapi.routing import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field

from config.database import SessionDependency
from model.user import User
from services.authentication import get_logged_in_user, login_user, register_user
from services.user_repository import get_contacts, get_user_by_username, save_user


class Token(BaseModel):
    token: str
    token_type: str


class RegisterCredentials(BaseModel):
    username: str = Field(max_length=20)
    password: str = Field(max_length=100)


prefix = "/api/v1/users"


router = APIRouter(
    prefix=prefix
)


@router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDependency):
    "An endpoint for logging in"
    token = login_user(form_data.username, form_data.password, session)
    return Token(token=token, token_type="bearer")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(credentials: Annotated[RegisterCredentials, Body()], session: SessionDependency):
    "An endpoint for creating a new user"
    register_user(credentials.username, credentials.password, session)


@router.get("/contacts")
async def contacts(user: Annotated[User, Depends(get_logged_in_user)], session: SessionDependency):
    "An endpoint to get contacts"
    return get_contacts(user, session)


@router.get("/exists/{username}")
async def exists(session: SessionDependency, username: str = ""):
    "Check whether a user with a specific username exists"
    user = get_user_by_username(username, session)
    if user == None:
        return False
    return True

# I think I'll just. Let it stay here actually


@router.get("/secret")
async def secret(user: Annotated[User, Depends(get_logged_in_user)]):
    "A test endpoint to check whether the authentication works"
    return {"msg": "Haii!"}
