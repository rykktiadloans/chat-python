from fastapi import APIRouter
from fastapi.responses import FileResponse


router = APIRouter()


@router.get("/")
async def get_home():
    "Get a page for the chat"
    return FileResponse(path="static/index.html")


@router.get("/login")
async def get_login():
    "Get a login page"
    return FileResponse(path="static/index.html")


@router.get("/register")
async def get_register():
    "Get a register page"
    return FileResponse(path="static/index.html")
