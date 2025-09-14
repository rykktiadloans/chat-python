from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel, table


class User(SQLModel, table=True):
    "User class"

    id: int | None = Field(title="id", default=None, primary_key=True)
    username: str = Field(title="username", index=True, unique=True)
    password: str = Field(title="password")

    sent: list["Message"] = Relationship(
        back_populates="sender",
        cascade_delete=True,
        sa_relationship_kwargs={"foreign_keys": "Message.sender_id"}
    )
    received: list["Message"] = Relationship(
        back_populates="recipient",
        cascade_delete=True,
        sa_relationship_kwargs={"foreign_keys": "Message.recipient_id"}
    )

    __tablename__ = "users"
