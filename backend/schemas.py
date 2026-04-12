from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional


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

    model_config = ConfigDict(from_attributes=True)


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

    model_config = ConfigDict(from_attributes=True)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class BloodRequestCreate(BaseModel):
    patient_name: str
    blood_group: str
    units_required: int
    hospital_name: str
    city: str
    area: Optional[str] = None
    contact_phone: str
    is_emergency: bool = False


class BloodRequestOut(BaseModel):
    id: int
    patient_name: str
    blood_group: str
    units_required: int
    hospital_name: str
    city: str
    area: Optional[str] = None
    contact_phone: str
    is_emergency: bool
    status: str
    requester_user_id: Optional[int] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class BloodRequestUpdate(BaseModel):
    patient_name: Optional[str] = None
    blood_group: Optional[str] = None
    units_required: Optional[int] = None
    hospital_name: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    contact_phone: Optional[str] = None
    is_emergency: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


class RequestResponseCreate(BaseModel):
    request_id: int
    donor_id: int


class RequestResponseOut(BaseModel):
    id: int
    request_id: int
    donor_id: int
    status: str

    model_config = ConfigDict(from_attributes=True)