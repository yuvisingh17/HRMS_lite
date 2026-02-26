from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from typing import List, Optional
from enum import Enum


class AttendanceStatus(str, Enum):
    present = "Present"
    absent = "Absent"


# ── Employee ──────────────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id", "full_name", "department")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()


class EmployeeOut(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str

    model_config = {"from_attributes": True}


# ── Attendance ─────────────────────────────────────────────────────────────────

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus


class AttendanceOut(BaseModel):
    id: str
    employee_id: str
    date: date
    status: AttendanceStatus

    model_config = {"from_attributes": True}


# ── Summary ────────────────────────────────────────────────────────────────────

class AttendanceSummary(BaseModel):
    total_days: int
    present_days: int
    absent_days: int


class DashboardStats(BaseModel):
    total_employees: int
    departments: int
    present_today: int
    absent_today: int
