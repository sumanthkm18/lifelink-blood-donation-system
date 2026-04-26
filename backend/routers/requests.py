from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import BloodRequest, Donor
from schemas import BloodRequestCreate, BloodRequestOut, BloodRequestUpdate
from auth import get_current_user, require_role

router = APIRouter(tags=["Requests"])

VALID_BLOOD_GROUPS = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"}


def normalize_blood_group(bg: str) -> str:
    return bg.replace(" ", "+").strip().upper()


def is_owner_or_admin(current_user, req: BloodRequest) -> bool:
    return (getattr(current_user, "role", "") == "ADMIN") or (
        req.requester_user_id == getattr(current_user, "id", None)
    )


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
        requester_user_id=current_user.id,
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


@router.get("", response_model=List[BloodRequestOut])
def list_requests(
    city: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(BloodRequest)

    if getattr(current_user, "role", "") != "ADMIN":
        q = q.filter(BloodRequest.requester_user_id == current_user.id)

    if city:
        q = q.filter(func.lower(func.trim(BloodRequest.city)) == city.strip().lower())
    if status_filter:
        q = q.filter(BloodRequest.status == status_filter.strip().lower())

    rows = q.order_by(BloodRequest.id.desc()).offset(skip).limit(limit).all()
    return [BloodRequestOut.model_validate(r, from_attributes=True) for r in rows]


@router.get("/{request_id}", response_model=BloodRequestOut)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if getattr(current_user, "role", "") != "ADMIN":
        if req.requester_user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not allowed")
    return BloodRequestOut.model_validate(req, from_attributes=True)


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
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(req)
    db.commit()
    return {"message": f"Request {request_id} deleted"}


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
    return BloodRequestOut.model_validate(req, from_attributes=True)


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


@router.get("/{request_id}/matching-donors")
def matching_donors(request_id: int, db: Session = Depends(get_db)):
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    city = (req.city or "").strip().lower()
    bg = (req.blood_group or "").strip().upper().replace(" ", "+")
    donors = db.query(Donor).filter(
        func.lower(func.trim(Donor.city)) == city,
        func.upper(func.trim(Donor.blood_group)) == bg
    ).all()
    return {"request_id": request_id, "blood_group": bg, "city": req.city, "total_matches": len(donors), "donors": donors}
