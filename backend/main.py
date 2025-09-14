from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers.auth_router import router as auth_router
from routers.messages_router import router as message_router
from routers.attachment_router import router as attachment_router
from routers.frontend_router import router as frontend_router
from config.database import database_init

@asynccontextmanager
async def lifespan(app: FastAPI):
    "Lifespan function. Stuff before `yield` runs before the startup"
    database_init()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(message_router)
app.include_router(attachment_router)
app.include_router(frontend_router)

app.mount("/assets", StaticFiles(directory="static/assets"), name="static")

@app.get("/")
async def home(): 
    return {"Test": "test"}
