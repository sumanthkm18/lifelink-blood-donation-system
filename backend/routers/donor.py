from fastapi import APIRouter, Depends , HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Donor
from database import SessionLocal
from schemas import DonorCreate, DonorUpdate, DonorOut
from auth import get_current_user
from auth import require_role  

router = APIRouter()

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔍 Search donors
@router.get("/search", response_model=list[DonorOut])
def search_blood(blood_group: str, city: str = None, db: Session = Depends(get_db)):
    blood_group = blood_group.replace(" ", "+").upper().strip()

    query = db.query(Donor).filter(Donor.blood_group == blood_group)

    if city:
        query = query.filter(func.lower(func.trim(Donor.city)) == city.lower().strip())

    donors = query.all()
    return donors

@router.get("/donors", response_model=list[DonorOut])
def get_all_donors(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    
    donors = db.query(Donor).all()
    return donors

# ➕ Add new donor
@router.post("/add_donor", response_model=DonorOut, status_code=status.HTTP_201_CREATED)
def add_donor(payload: DonorCreate, db: Session = Depends(get_db)):

    valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    blood_group = payload.blood_group.replace(" ", "+").upper().strip()

    if blood_group not in valid_groups:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blood group. Allowed: A+, A-, B+, B-, AB+, AB-, O+, O-"
        )

    name_clean = payload.name.strip()
    city_clean = payload.city.strip()

    # Duplicate check (case-insensitive)
    existing = db.query(Donor).filter(
        func.lower(func.trim(Donor.name)) == name_clean.lower(),
        Donor.blood_group == blood_group,
        func.lower(func.trim(Donor.city)) == city_clean.lower()
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Duplicate donor already exists with id={existing.id}"
        )

    new_donor = Donor(name=name_clean, blood_group=blood_group, city=city_clean)
    db.add(new_donor)
    db.commit()
    db.refresh(new_donor)
    return new_donor


# ✏ Update donor city
@router.put("/donor/{donor_id}", response_model=DonorOut)
def update_donor_city(donor_id: int, payload: DonorUpdate, db: Session = Depends(get_db)):

    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if donor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor not found")

    donor.city = payload.city.strip()
    db.commit()
    db.refresh(donor)
    return donor


# ❌ Delete donor
@router.delete("/donor/{donor_id}", status_code=status.HTTP_200_OK)
def delete_donor(
    donor_id: int,
    db: Session = Depends(get_db),
    _admin = Depends(require_role("ADMIN"))
):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if donor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor not found")

    db.delete(donor)
    db.commit()
    return {"message": f"Donor with id {donor_id} deleted successfully"}