from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Donor
from database import get_db
from schemas import DonorCreate, DonorUpdate, DonorOut
from auth import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=list[DonorOut])
def search_blood(blood_group: str = "", city: str = "", db: Session = Depends(get_db)):
    blood_group = blood_group.replace(" ", "+").upper().strip()
    query = db.query(Donor)
    if blood_group:
        query = query.filter(Donor.blood_group == blood_group)
    if city:
        query = query.filter(func.lower(func.trim(Donor.city)) == city.lower().strip())
    return query.all()

@router.get("/all", response_model=list[DonorOut])
def get_all_donors(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Donor).all()

@router.post("/add", response_model=DonorOut, status_code=status.HTTP_201_CREATED)
def add_donor(payload: DonorCreate, db: Session = Depends(get_db)):
    valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    blood_group = payload.blood_group.replace(" ", "+").upper().strip()
    if blood_group not in valid_groups:
        raise HTTPException(status_code=400, detail="Invalid blood group")
    name_clean = payload.name.strip()
    city_clean = payload.city.strip()
    existing = db.query(Donor).filter(
        func.lower(func.trim(Donor.name)) == name_clean.lower(),
        Donor.blood_group == blood_group,
        func.lower(func.trim(Donor.city)) == city_clean.lower()
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Donor already exists with id={existing.id}")
    new_donor = Donor(name=name_clean, blood_group=blood_group, city=city_clean)
    db.add(new_donor)
    db.commit()
    db.refresh(new_donor)
    return new_donor

@router.put("/{donor_id}", response_model=DonorOut)
def update_donor(donor_id: int, payload: DonorUpdate, db: Session = Depends(get_db)):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    donor.city = payload.city.strip()
    db.commit()
    db.refresh(donor)
    return donor

@router.delete("/{donor_id}", status_code=status.HTTP_200_OK)
def delete_donor(donor_id: int, db: Session = Depends(get_db), _admin=Depends(require_role("ADMIN"))):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    db.delete(donor)
    db.commit()
    return {"message": f"Donor {donor_id} deleted"}
