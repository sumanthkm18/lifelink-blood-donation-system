import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================
# DATABASE URL
# =========================

DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback for local development (optional)
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost/lifelink_db"


# =========================
# ENGINE
# =========================

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"} if "render" in DATABASE_URL else {}
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