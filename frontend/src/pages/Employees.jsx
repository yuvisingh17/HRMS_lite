import { useEffect, useState } from "react";
import { getEmployees, addEmployee, deleteEmployee } from "../api/api";
import {
  Spinner, EmptyState, ErrorBanner, SuccessBanner,
  Modal, ConfirmDialog, LoadingRows,
} from "../components/UI";

const DEPARTMENTS = [
  "Engineering", "Design", "Product", "Marketing",
  "Sales", "Finance", "HR", "Operations", "Legal", "Support",
];

export default function Employees() {
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [search, setSearch]         = useState("");

  // Add modal
  const [showAdd, setShowAdd]       = useState(false);
  const [form, setForm]             = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [formError, setFormError]   = useState("");
  const [saving, setSaving]         = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const load = () => {
    setLoading(true);
    getEmployees()
      .then((r) => setEmployees(r.data))
      .catch(() => setError("Failed to load employees."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = employees.filter(
    (e) =>
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await addEmployee(form);
      setSuccess(`Employee "${form.full_name}" added successfully.`);
      setShowAdd(false);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      load();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to add employee.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget.employee_id);
      setSuccess(`Employee "${deleteTarget.full_name}" deleted.`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Failed to delete employee.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">
  Employees
</h1>

<p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
  {loading
    ? "Loading…"
    : `${employees.length} total employee${employees.length !== 1 ? "s" : ""}`}
</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowAdd(true)}>
          <span className="text-lg leading-none">+</span> Add Employee
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />
      <SuccessBanner message={success} onDismiss={() => setSuccess("")} />

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
        <input
          className="input pl-10"
          placeholder="Search by name, ID, email or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {/* <div className="card overflow-hidden"> */}
      <div className="table-container">
        <table className="w-full">
          <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700/40">
              {["Employee", "ID", "Department", "Email", "Actions"].map((h) => (
                <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRows cols={5} rows={5} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    icon="👤"
                    title={search ? "No employees match your search" : "No employees yet"}
                    subtitle={search ? "Try a different search term" : "Click 'Add Employee' to get started"}
                  />
                </td>
              </tr>
            ) : (
              filtered.map((emp, i) => (
                <tr
                  key={emp.employee_id}
                  className="border-b border-slate-200 dark:border-slate-700/20
           hover:bg-slate-50 dark:hover:bg-slate-800/30
           transition-colors animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/25 to-violet-500/25
                                      border border-indigo-500/20 flex items-center justify-center text-sm
                                      font-bold text-indigo-300 font-display shrink-0">
                        {emp.full_name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{emp.full_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-slate-100 text-slate-600
           dark:bg-slate-800 dark:text-slate-400
           px-2 py-1 rounded-md">
                      {emp.employee_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 bg-slate-100
           dark:text-slate-300 dark:bg-slate-800/60
           px-2.5 py-0.5 rounded-lg">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{emp.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="btn-danger"
                      onClick={() => setDeleteTarget(emp)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <Modal open={showAdd} title="Add New Employee" onClose={() => { setShowAdd(false); setFormError(""); }}>
        <form onSubmit={handleAdd} className="space-y-4">
          <ErrorBanner message={formError} onDismiss={() => setFormError("")} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Employee ID *</label>
              <input
                className="input"
                placeholder="e.g. EMP001"
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Full Name *</label>
              <input
                className="input"
                placeholder="e.g. Yuvraj Singh"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email Address *</label>
            <input
              className="input"
              type="email"
              placeholder="e.g. Yuvraj@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Department *</label>
            <select
              className="input"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setShowAdd(false); setFormError(""); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
              {saving && <Spinner size="sm" />}
              Add Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteTarget?.full_name}"? This will also remove all their attendance records. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
