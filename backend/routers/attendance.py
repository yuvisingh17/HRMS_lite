import uuid
from datetime import date as DateType
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/", response_model=schemas.AttendanceOut, status_code=status.HTTP_201_CREATED)
def mark_attendance(payload: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter_by(employee_id=payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")

    existing = (
        db.query(models.Attendance)
        .filter_by(employee_id=payload.employee_id, date=payload.date)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attendance already marked for {payload.date}.",
        )

    record = models.Attendance(id=str(uuid.uuid4()), **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/summary/{employee_id}", response_model=schemas.AttendanceSummary)
def get_summary(employee_id: str, db: Session = Depends(get_db)):
    if not db.query(models.Employee).filter_by(employee_id=employee_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")

    records = db.query(models.Attendance).filter_by(employee_id=employee_id).all()
    present = sum(1 for r in records if r.status == models.AttendanceStatus.present)
    total = len(records)
    return schemas.AttendanceSummary(
        total_days=total, present_days=present, absent_days=total - present
    )


@router.get("/{employee_id}", response_model=List[schemas.AttendanceOut])
def get_attendance(
    employee_id: str,
    date: Optional[DateType] = Query(None, description="Filter by specific date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    if not db.query(models.Employee).filter_by(employee_id=employee_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")

    query = db.query(models.Attendance).filter_by(employee_id=employee_id)
    if date:
        query = query.filter(models.Attendance.date == date)
    return query.order_by(models.Attendance.date.desc()).all()
