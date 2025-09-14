from typing import Annotated

from fastapi import Depends
from .env_vars import settings, database_uri
from sqlmodel import SQLModel, Session, create_engine
import psycopg2



engine = create_engine(database_uri, echo=True)


def database_init():
    "Initialize the database"
    SQLModel.metadata.create_all(engine)


def get_session():
    "Get the current active session"
    with Session(engine) as session:
        yield session


SessionDependency = Annotated[Session, Depends(get_session)]
