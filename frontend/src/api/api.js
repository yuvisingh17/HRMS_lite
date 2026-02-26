import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// ── Employees ──────────────────────────────────────────────────────────────────
export const getEmployees = () => api.get("/employees/");
export const addEmployee  = (data) => api.post("/employees/", data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// ── Attendance ─────────────────────────────────────────────────────────────────
export const getAttendance   = (empId, date) =>
  api.get(`/attendance/${empId}`, { params: date ? { date } : {} });
export const markAttendance  = (data) => api.post("/attendance/", data);
export const getAttendanceSummary = (empId) => api.get(`/attendance/summary/${empId}`);

// ── Dashboard ──────────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get("/dashboard/stats");

export default api;
