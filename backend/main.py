from fastapi import FastAPI
from routers.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router)

@app.get("/")
async def home(): 
    return {"Test": "test"}
