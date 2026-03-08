from pydantic import BaseModel, EmailStr , ConfigDict
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

# =====================
# DONOR SCHEMAS
# =====================

class DonorCreate(BaseModel):
    name: str
    blood_group: str
    city: str

class DonorUpdate(BaseModel):
    city: str

class DonorOut(BaseModel):
    id: int
    name: str
    blood_group: str
    city: str

    class Config:
        from_attributes = True


# =====================
# USER SCHEMAS
# =====================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "DONOR"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class BloodRequestCreate(BaseModel):
    patient_name: str
    blood_group: str
    units_required: int
    hospital_name: str
    city: str
    area: str | None = None
    contact_phone: str
    is_emergency: bool = False

class BloodRequestOut(BaseModel):
    id: int
    patient_name: str
    blood_group: str
    units_required: int
    hospital_name: str
    city: str
    area: str | None
    contact_phone: str
    is_emergency: bool
    status: str
    requester_user_id: int
    created_at: Optional[datetime]= None

model_config = ConfigDict(from_attributes=True)
    

class BloodRequestUpdate(BaseModel):
    patient_name: str | None = None
    blood_group: str | None = None
    units_required: int | None = None
    hospital_name: str | None = None
    city: str | None = None
    area: str | None = None
    contact_phone: str | None = None
    is_emergency: bool | None = None

    class Config:
        from_attributes = True


class RequestResponseCreate(BaseModel):
    request_id: int
    donor_id: int


class RequestResponseOut(BaseModel):
    id: int
    request_id: int
    donor_id: int
    status: str

    model_config = ConfigDict(from_attributes=True) 