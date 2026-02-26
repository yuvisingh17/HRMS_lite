from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_employees = db.query(models.Employee).count()

    departments = (
        db.query(models.Employee.department).distinct().count()
    )

    today = date.today()
    today_records = db.query(models.Attendance).filter(models.Attendance.date == today).all()
    present_today = sum(1 for r in today_records if r.status == models.AttendanceStatus.present)
    absent_today = sum(1 for r in today_records if r.status == models.AttendanceStatus.absent)

    return schemas.DashboardStats(
        total_employees=total_employees,
        departments=departments,
        present_today=present_today,
        absent_today=absent_today,
    )
