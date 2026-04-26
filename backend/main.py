from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

# 🔹 Import your routers (make sure these files exist)
from backend.routers import auth, users, donors, requests

# =========================
# CREATE TABLES
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# INIT APP
# =========================
app = FastAPI()

# =========================
# CORS (IMPORTANT for frontend)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROOT ROUTE (fix white screen)
# =========================
@app.get("/")
def home():
    return {"message": "Lifelink Backend is Running 🚀"}

# =========================
# INCLUDE ROUTERS
# =========================
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(donors.router, prefix="/donors", tags=["Donors"])
app.include_router(requests.router, prefix="/requests", tags=["Requests"])