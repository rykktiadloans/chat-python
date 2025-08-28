import pathlib
from typing import Annotated
from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import FileResponse
from starlette.status import HTTP_404_NOT_FOUND

from config.database import SessionDependency
from services.attachment_repository import ATTACHMENTS_DIR, get_attachment_by_stored_name


prefix = "/api/v1/attachments"

router = APIRouter(
    prefix = prefix
)

@router.get("/{stored_name}")
async def get_attachment(stored_name: Annotated[str, Path], session: SessionDependency):
    "An endpoint for getting attachments' files"
    attachment = get_attachment_by_stored_name(stored_name, session)
    if attachment == None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Attachment could not be found"
        )
    return FileResponse(path=str(pathlib.Path(ATTACHMENTS_DIR).joinpath(attachment.stored_name)))
