from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import RequestResponseCreate, RequestResponseOut
from fastapi import HTTPException
from database import get_db
from models import RequestResponse
from schemas import RequestResponseCreate, RequestResponseOut

router = APIRouter(prefix="/responses", tags=["Responses"])


@router.post("", response_model=RequestResponseOut)
def create_response(payload: RequestResponseCreate, db: Session = Depends(get_db)):

    response = RequestResponse(
        request_id=payload.request_id,
        donor_id=payload.donor_id,
        status="pending"
    )

    db.add(response)
    db.commit()
    db.refresh(response)

    return RequestResponseOut.model_validate(response, from_attributes=True)


@router.get("", response_model=list[RequestResponseOut])
def get_responses(db: Session = Depends(get_db)):

    responses = db.query(RequestResponse).all()

    return [RequestResponseOut.model_validate(r, from_attributes=True) for r in responses]

@router.put("/approve/{response_id}", response_model=RequestResponseOut)
def approve_response(response_id: int, db: Session = Depends(get_db)):

    response = db.query(RequestResponse).filter(RequestResponse.id == response_id).first()

    if not response:
        raise HTTPException(status_code=404, detail="Response not found")

    response.status = "approved"

    db.commit()
    db.refresh(response)

    return RequestResponseOut.model_validate(response, from_attributes=True)

@router.put("/reject/{response_id}", response_model=RequestResponseOut)
def reject_response(response_id: int, db: Session = Depends(get_db)):

    response = db.query(RequestResponse).filter(RequestResponse.id == response_id).first()

    if not response:
        raise HTTPException(status_code=404, detail="Response not found")

    response.status = "rejected"

    db.commit()
    db.refresh(response)

    return RequestResponseOut.model_validate(response, from_attributes=True)