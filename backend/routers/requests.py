from typing import List, Optional
from models import Donor, RequestResponse
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import BloodRequest, RequestResponse
from schemas import (
    BloodRequestCreate,
    BloodRequestOut,
    BloodRequestUpdate,
)
from auth import get_current_user, require_role

router = APIRouter(tags=["Requests"])


# -------------------------
# Helpers
# -------------------------
VALID_BLOOD_GROUPS = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"}


def normalize_blood_group(bg: str) -> str:
    # Handles O%2B -> "O+" cases and accidental spaces
    return bg.replace(" ", "+").strip().upper()


def is_owner_or_admin(current_user, req: BloodRequest) -> bool:
    return (getattr(current_user, "role", "") == "ADMIN") or (
        req.requester_user_id == getattr(current_user, "id", None)
    )


# -------------------------
# Create Request (USER)
# POST /requests
# -------------------------
@router.post("", response_model=BloodRequestOut, status_code=status.HTTP_201_CREATED)
def create_request(
    payload: BloodRequestCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    bg = normalize_blood_group(payload.blood_group)
    if bg not in VALID_BLOOD_GROUPS:
        raise HTTPException(status_code=400, detail="Invalid blood group")

    if payload.units_required <= 0:
        raise HTTPException(status_code=400, detail="units_required must be > 0")

    req = BloodRequest(
        requester_user_id=current_user.id,  # MUST match models.py field name
        patient_name=payload.patient_name.strip(),
        blood_group=bg,
        units_required=payload.units_required,
        hospital_name=payload.hospital_name.strip(),
        city=payload.city.strip(),
        area=(payload.area.strip() if payload.area else None),
        contact_phone=payload.contact_phone.strip(),
        is_emergency=payload.is_emergency,
        status="pending",
    )

    db.add(req)
    db.commit()
    db.refresh(req)
    return req


# -------------------------
# List Requests
# GET /requests
# -------------------------
@router.get("", response_model=List[BloodRequestOut])
def list_requests(
    city: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(BloodRequest)

    # Non-admin users should see only approved requests (admin can see all)
    if getattr(current_user, "role", "") != "ADMIN":
        q = q.filter(BloodRequest.status == "approved")

    if city:
        q = q.filter(func.lower(func.trim(BloodRequest.city)) == city.strip().lower())

    if status_filter:
        q = q.filter(BloodRequest.status == status_filter.strip().lower())

    rows = q.order_by(BloodRequest.id.desc()).offset(skip).limit(limit).all()

    # Convert ORM -> Pydantic safely (prevents ResponseValidationError)
    return [BloodRequestOut.model_validate(r, from_attributes=True) for r in rows]


# -------------------------
# Get One Request
# GET /requests/{request_id}
# -------------------------
@router.get("/{request_id}", response_model=BloodRequestOut)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # Non-admin users can view only approved requests OR their own pending requests
    if getattr(current_user, "role", "") != "ADMIN":
        if req.status != "approved" and req.requester_user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not allowed to view this request")

    return BloodRequestOut.model_validate(req, from_attributes=True)


# -------------------------
# Update Request (Owner/Admin)
# PUT /requests/{request_id}
# -------------------------
@router.put("/{request_id}", response_model=BloodRequestOut)
def update_request(
    request_id: int,
    payload: BloodRequestUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if not is_owner_or_admin(current_user, req):
        raise HTTPException(status_code=403, detail="You can edit only your own request")

    if payload.blood_group is not None:
        bg = normalize_blood_group(payload.blood_group)
        if bg not in VALID_BLOOD_GROUPS:
            raise HTTPException(status_code=400, detail="Invalid blood group")
        req.blood_group = bg

    if payload.patient_name is not None:
        req.patient_name = payload.patient_name.strip()

    if payload.units_required is not None:
        if payload.units_required <= 0:
            raise HTTPException(status_code=400, detail="units_required must be > 0")
        req.units_required = payload.units_required

    if payload.hospital_name is not None:
        req.hospital_name = payload.hospital_name.strip()

    if payload.city is not None:
        req.city = payload.city.strip()

    if payload.area is not None:
        req.area = payload.area.strip()

    if payload.contact_phone is not None:
        req.contact_phone = payload.contact_phone.strip()

    if payload.is_emergency is not None:
        req.is_emergency = payload.is_emergency

    # Any edit by user sets it back to pending (admin can re-approve)
    if getattr(current_user, "role", "") != "ADMIN":
        req.status = "pending"

    db.commit()
    db.refresh(req)
    return BloodRequestOut.model_validate(req, from_attributes=True)


# -------------------------
# Delete Request (Owner/Admin)
# DELETE /requests/{request_id}
# -------------------------
@router.delete("/{request_id}", status_code=status.HTTP_200_OK)
def delete_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if not is_owner_or_admin(current_user, req):
        raise HTTPException(status_code=403, detail="You can delete only your own request")

    db.delete(req)
    db.commit()
    return {"message": f"Request {request_id} deleted successfully"}


# -------------------------
# Admin Approve / Reject
# PUT /requests/{request_id}/approve
# PUT /requests/{request_id}/reject
# -------------------------
@router.put("/{request_id}/approve", response_model=BloodRequestOut)
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_role("ADMIN")),
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = "approved"
    db.commit()
    db.refresh(req)
    return req

@router.put("/{request_id}/reject", response_model=BloodRequestOut)
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_role("ADMIN")),
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = "rejected"
    db.commit()
    db.refresh(req)
    return BloodRequestOut.model_validate(req, from_attributes=True)

@router.put("/{request_id}/approve", response_model=BloodRequestOut)
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()

    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admin can approve requests")

    req.status = "approved"

    db.commit()
    db.refresh(req)

    return req

@router.put("/{request_id}/reject", response_model=BloodRequestOut)
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()

    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admin can reject requests")

    req.status = "rejected"

    db.commit()
    db.refresh(req)

    return BloodRequestOut.model_validate(req, from_attributes=True)

@router.get("", response_model=list[BloodRequestOut])
def list_requests(db: Session = Depends(get_db)):
    requests = db.query(BloodRequest).all()
    return [BloodRequestOut.model_validate(r, from_attributes=True) for r in requests]

@router.get("/{request_id}/approved-donors")
def get_approved_donors(request_id: int, db: Session = Depends(get_db)):

    approved = db.query(RequestResponse).filter(
        RequestResponse.request_id == request_id,
        RequestResponse.status == "approved"
    ).all()

    return approved

@router.get("/{request_id}/matching-donors")
def matching_donors(request_id: int, db: Session = Depends(get_db)):
    # 1) get the request
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # normalize city + blood group for matching
    city = (req.city or "").strip().lower()
    bg = (req.blood_group or "").strip().upper().replace(" ", "+")

    # 2) find donors
    donors = db.query(Donor).filter(
        func.lower(func.trim(Donor.city)) == city,
        func.upper(func.trim(Donor.blood_group)) == bg
    ).all()

    return {
        "request_id": request_id,
        "blood_group": bg,
        "city": req.city,
        "total_matches": len(donors),
        "donors": donors
    }