
from pydantic import BaseModel


class User(BaseModel):
    "User class"
    id: int
    username: str
    password: str

