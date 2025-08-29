from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers.auth import router as auth_router
from routers.messages import router as message_router
from routers.attachments import router as attachment_router
from routers.frontend import router as frontend_router
from config.database import database_init

@asynccontextmanager
async def lifespan(app: FastAPI):
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
