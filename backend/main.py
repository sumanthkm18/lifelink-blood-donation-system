from fastapi import FastAPI, Depends
from fastapi import Depends
from database import engine
from models import Base
import routers
from routers.auth import router as auth_router   # 👈 IMPORTANT
from routers.donor import router as donor_router  
from routers.requests import router as requests_router      
from auth import get_current_user
from routers.responses import router as responses_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)   # 👈 Must match the name above
app.include_router(donor_router)   # 👈 Must match the name above
app.include_router(responses_router)   # 👈 Must match the name above
app.include_router(requests_router,prefix="/requests")   # 👈 Must match the name above

@app.get("/me")
def me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Lifelink Backend Running Successfully"}

app.include_router(auth_router)   # 👈 Must match the name above