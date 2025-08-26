from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import select
from config.database import SessionDependency
from model.user import User
from services.encryption import hashify

def get_user_by_username(username: str, session: SessionDependency) -> User | None:
    "Get a user by their username. If nothing is found, return None."
    return session.exec(
        select(User).where(User.username == username)
    ).one_or_none()

def get_user_by_id(id: int, session: SessionDependency) -> User | None:
    "Get a user by id. If nothing is found, return None."
    return session.get(User, id)

def save_user(user: User, session: SessionDependency) -> User:
    "Save a user to the database and return the updated version"
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
