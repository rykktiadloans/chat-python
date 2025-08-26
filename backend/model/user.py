
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, table


class User(SQLModel, table=True):
    "User class"

    id: int | None = Field(title="id", default=None, primary_key=True)
    username: str = Field(title="username", index=True, unique=True)
    password: str = Field(title="password")

    __tablename__ = "users"

