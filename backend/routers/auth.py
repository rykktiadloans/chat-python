from typing import Annotated
from fastapi import Depends
from fastapi.routing import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from model.user import User
from services.authentication import get_logged_in_user, login_user

class Token(BaseModel):
    token: str
    token_type: str

prefix = "/api/v1/users"


router = APIRouter(
    prefix=prefix
)

@router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    "AP endpoint for logging in"
    token = login_user(form_data.username, form_data.password)
    return Token(token=token, token_type="bearer")

# Delete l8r
@router.get("/secret")
async def secret(user: Annotated[User, Depends(get_logged_in_user)]):
    "A test endpoint to check whether the authentication works"
    return {"msg": "Haii!"}
