from contextlib import asynccontextmanager
from fastapi import FastAPI
from routers.auth import router as auth_router
from config.database import database_init

@asynccontextmanager
async def lifespan(app: FastAPI):
    database_init()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)

@app.get("/")
async def home(): 
    return {"Test": "test"}
