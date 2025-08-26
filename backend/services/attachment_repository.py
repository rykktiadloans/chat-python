from datetime import datetime
import os
from fastapi import HTTPException, UploadFile, status
from sqlmodel import select
from config.database import SessionDependency
from model.attachment import FILE_SIZE, Attachment
from pathlib import Path

ATTACHMENTS_DIR = "upload/"

try:
    os.mkdir(ATTACHMENTS_DIR)
except FileExistsError:
    pass


def save_attachments_file(file: UploadFile, session: SessionDependency) -> Attachment:
    "Saves an attachments and its corresponding file"
    if file.size == None or file.size > FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File is too large"
        )
    current_time = datetime.now().strftime("%d%m%y%H%M%S%f")
    extension = "" if file.filename == None else Path(file.filename).suffix
    filename = Path(current_time).with_suffix(extension)
    final_path = Path(ATTACHMENTS_DIR).joinpath(filename)
    original_name = str(filename) if file.filename == None else file.filename
    try:
        with open(final_path, "wb") as f:
            f.write(file.file.read())
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save file for some reason"
        )
    finally:
        file.file.close()

    return Attachment(
        original_name=original_name,
        stored_name=str(filename)
    )

def get_attachment_by_stored_name(stored_name: str, session: SessionDependency) -> Attachment | None:
    "Get an attachment by its stored name. Returns None if nothing could be found"
    return session.exec(select(Attachment).where(Attachment.stored_name == stored_name)).one_or_none()
