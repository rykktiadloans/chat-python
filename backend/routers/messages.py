from datetime import datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, status
from pydantic import BaseModel, Field

from config.database import SessionDependency
from model.message import CONTENT_LENGTH, MessageRequest, MessageResponse
from model.page import PageDependency
from model.user import User
from services.authentication import get_logged_in_user
from services.message_repository import get_message_by_id, get_messages, save_message, save_message_request, delete_message as delete_message_from_db
from services.user_repository import get_user_by_username

class PatchPost(BaseModel):
    id: int
    content: str = Field(max_length=CONTENT_LENGTH)

prefix = "/api/v1/messages"

router = APIRouter(
    prefix=prefix
)

@router.post("/")
async def post_message(
        message_request: Annotated[MessageRequest, Body()], 
        user: Annotated[User, Depends(get_logged_in_user)], 
        session: SessionDependency):
    "An endpoint for making new messages"
    message = save_message_request(user, message_request, session)
    return MessageResponse(
        id=(0 if message.id == None else message.id),
        content=message.content,
        sent_at=message.sent_at,
        sender_username=user.username,
        recipient_username=message_request.recipient_username
    )

@router.patch("/")
async def patch_message(
        patch_post: Annotated[PatchPost, Body()], 
        user: Annotated[User, Depends(get_logged_in_user)], 
        session: SessionDependency):
    "An endpoint for patching messages"
    message = get_message_by_id(patch_post.id, session)

    if message == None or message.sender != user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    message.content = patch_post.content
    message.sent_at = datetime.now(timezone.utc)

    message = save_message(message, session)

    return MessageResponse(
        id=(0 if message.id == None else message.id),
        content=message.content,
        sent_at=message.sent_at,
        sender_username=user.username,
        recipient_username=message.recipient.username
    )

@router.delete("/{id}")
async def delete_message(
        id: Annotated[int, Path()],
        user: Annotated[User, Depends(get_logged_in_user)], 
        session: SessionDependency):
    "An endpoint for deleting messages"
    message = get_message_by_id(id, session)

    if message == None or message.sender != user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    delete_message_from_db(message, session)

@router.get("/")
async def get_message(
        recipient_username: Annotated[str, Query()],
        page: PageDependency, 
        user: Annotated[User, Depends(get_logged_in_user)], 
        session: SessionDependency):
    "An endpoint for getting new messages"
    recipient = get_user_by_username(recipient_username, session)
    if recipient == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipient '{recipient}' does not exist"
        )
    messages = get_messages(user, recipient, page, session)
    return list(map(lambda m: MessageResponse(
        id=(0 if m.id == None else m.id),
        content=m.content,
        sent_at=m.sent_at,
        sender_username=m.sender.username,
        recipient_username=m.recipient.username
    ), messages))
