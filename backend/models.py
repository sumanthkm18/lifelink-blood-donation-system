from sqlalchemy import Column, Integer, String, Boolean, DateTime , ForeignKey , func
from datetime import datetime
from database import Base


# ======================
# DONOR TABLE
# ======================
class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    blood_group = Column(String)
    city = Column(String)


# ======================
# USER TABLE
# ======================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="DONOR")
    is_active = Column(Boolean, default=True)


# ======================
# BLOOD REQUEST TABLE
# ======================
class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    blood_group = Column(String)
    units_required = Column(Integer)
    hospital_name = Column(String)
    city = Column(String)
    area = Column(String)
    contact_phone = Column(String)
    is_emergency = Column(Boolean, default=False)

    status = Column(String, default="pending")
    created_at = Column(DateTime, default=func.now())

    requester_user_id = Column(Integer, ForeignKey("users.id"))
       # 👈 ADD THIS

class RequestResponse(Base):
    __tablename__ = "request_responses"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(Integer, ForeignKey("blood_requests.id"))
    donor_id = Column(Integer, ForeignKey("donors.id"))

    status = Column(String, default="pending")  # accepted / rejected

    created_at = Column(DateTime, default=datetime.utcnow)