from pydantic import BaseModel
from sqlmodel import Relationship, SQLModel, Field

from model.message import Message


FILE_SIZE = 10_000_000
MAX_NAME_LENGTH = 30

class Attachment(SQLModel, table=True):
    "An attachment class representing the representation of the attachment in the database"

    id: int | None = Field(title="id", default=None, primary_key=True)
    original_name: str = Field(title="original_name", max_length=30)
    stored_name: str = Field(title="stored_name", unique=True)

    message_id: int | None = Field(title="message_id", default=None, foreign_key="messages.id", ondelete="CASCADE")

    message: Message | None = Relationship(back_populates="attachments")

    __tablename__ = "attachments"

class AttachmentResponse(BaseModel):
    original_name: str
    stored_name: str
