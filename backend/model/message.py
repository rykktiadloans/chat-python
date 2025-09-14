from datetime import datetime
from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from model.user import User

CONTENT_LENGTH = 1000


class Message(SQLModel, table=True):
    "Message class"

    id: int | None = Field(title="id", default=None, primary_key=True)
    content: str = Field(title="content", max_length=CONTENT_LENGTH)
    sent_at: datetime = Field(title="sent_at")

    sender_id: int | None = Field(
        title="sender_id", default=None, foreign_key="users.id", ondelete="CASCADE")
    recipient_id: int | None = Field(
        title="recipient_id", default=None, foreign_key="users.id", ondelete="CASCADE")

    sender: User | None = Relationship(
        back_populates="sent",
        sa_relationship_kwargs={"foreign_keys": "Message.sender_id"}
    )
    recipient: User | None = Relationship(
        back_populates="received",
        sa_relationship_kwargs={"foreign_keys": "Message.recipient_id"}
    )

    attachments: list["Attachment"] = Relationship(
        back_populates="message", cascade_delete=True)

    __tablename__ = "messages"


class MessageRequest(BaseModel):
    "A class that defines the body of a request to make new message"
    content: str = Field(max_length=CONTENT_LENGTH)
    recipient_username: str
