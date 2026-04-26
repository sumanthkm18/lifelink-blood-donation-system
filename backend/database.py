import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================
# DATABASE URL
# =========================

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL is not set!")

# =========================
# ENGINE
# =========================

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"}
)

# =========================
# SESSION
# =========================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =========================
# BASE
# =========================

Base = declarative_base()

# =========================
# 🔥 ADD THIS (IMPORTANT)
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()