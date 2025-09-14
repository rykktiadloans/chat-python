from datetime import datetime, timezone
from fastapi import HTTPException, UploadFile, status
from sqlmodel import and_, desc, or_, select
from config.database import SessionDependency
from model.attachment import Attachment
from model.message import Message, MessageRequest
from model.page import PageDependency
from model.user import User
from services.attachment_repository import save_attachments_file
from services.user_repository import get_user_by_username
import logging


def save_message(message: Message, session: SessionDependency) -> Message:
    "Save a message"
    session.add(message)
    session.commit()
    session.refresh(message)
    return message


def save_message_request(sender: User, message_request: MessageRequest, files: list[UploadFile], session: SessionDependency) -> Message:
    "Check that the users in message_request actually exist and then save a message based on the details"
    recipient = get_user_by_username(
        message_request.recipient_username, session)

    if recipient == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipient '{message_request.recipient_username}' does not exist"
        )
    if sender.id == recipient.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Recipient and sender are the same!"
        )

    attachments = []
    for f in files:
        attachments.append(save_attachments_file(f, session))

    return save_message(Message(
        content=message_request.content,
        sent_at=datetime.now(timezone.utc),
        sender=sender,
        recipient=recipient,
        attachments=attachments
    ), session)


def get_messages(sender: User, recipient: User, page: PageDependency, session: SessionDependency) -> list[Message]:
    "Get a list of messages made between sender and recipient"
    return list(session.exec(
        select(Message)
        .where(or_(
            and_(Message.sender == sender, Message.recipient == recipient),
            and_(Message.sender == recipient and Message.recipient == sender))
        )
        .order_by(desc(Message.sent_at))
        .offset(page.size * page.page + page.offset)
        .limit(page.size)
    ).all())


def get_message_by_id(id: int, session: SessionDependency) -> Message | None:
    "Returns a message with the specified ID, or none if it cannot find it"
    return session.get(Message, id)


def delete_message(message: Message, session: SessionDependency) -> None:
    "Deletes a message"
    session.delete(message)
    session.commit()
