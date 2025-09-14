from datetime import datetime
from operator import and_
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlmodel import col, desc, or_, select, text
from config.database import SessionDependency
from model.message import Message
from model.page import PageDependency
from model.user import User
from services.encryption import hashify


class Contact(BaseModel):
    message_id: int
    other: str
    content: str
    sent_at: datetime


def get_user_by_username(username: str, session: SessionDependency) -> User | None:
    "Get a user by their username. If nothing is found, return None."
    return session.exec(
        select(User).where(User.username == username)
    ).one_or_none()


def get_user_by_id(id: int, session: SessionDependency) -> User | None:
    "Get a user by id. If nothing is found, return None."
    return session.get(User, id)


def get_contacts(user: User, session: SessionDependency) -> list[Contact]:
    "Get a list of contacts"
    sql = """
SELECT DISTINCT ON (other, sent_at)
    first_value(id) OVER wnd id, 
    other, 
    first_value(content) OVER wnd content, 
    first_value(sent_at) OVER wnd sent_at
FROM (
    SELECT 
        messages.id, 
        sender.username sender, 
        recipient.username recipient, 
        CASE 
            WHEN sender.username = :username THEN recipient.username
            ELSE sender.username 
        END AS other,
        messages.content, 
        messages.sent_at
    FROM messages
    LEFT JOIN users AS sender ON sender.id = messages.sender_id
    LEFT JOIN users AS recipient ON recipient.id = messages.recipient_id
    WHERE sender.username = :username OR recipient.username = :username)
WINDOW wnd AS (
    PARTITION BY other ORDER BY sent_at DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
ORDER BY sent_at DESC;
"""
    result = session.connection().execute(
        text(sql), {"username": user.username})
    contacts: list[Contact] = []
    for row in result:
        contacts.append(Contact(
            message_id=int(row.id),
            other=row.other,
            content=row.content,
            sent_at=row.sent_at
        ))
    return contacts


def save_user(user: User, session: SessionDependency) -> User:
    "Save a user to the database and return the updated version"
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
