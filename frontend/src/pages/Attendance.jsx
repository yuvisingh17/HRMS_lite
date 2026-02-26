import { useEffect, useState } from "react";
import {
  getEmployees, getAttendance, markAttendance, getAttendanceSummary,
} from "../api/api";
import {
  Spinner, EmptyState, ErrorBanner, SuccessBanner, LoadingRows,
} from "../components/UI";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function Attendance() {
  const [employees, setEmployees]   = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [records, setRecords]       = useState([]);
  const [summary, setSummary]       = useState(null);

  const [loadingEmps, setLoadingEmps]   = useState(true);
  const [loadingRecs, setLoadingRecs]   = useState(false);
  const [saving, setSaving]             = useState(false);

  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [formError, setFormError]   = useState("");

  // Mark attendance form
  const [form, setForm]             = useState({ date: today(), status: "Present" });

  // Filter
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    getEmployees()
      .then((r) => setEmployees(r.data))
      .catch(() => setError("Failed to load employees."))
      .finally(() => setLoadingEmps(false));
  }, []);

  const loadRecords = (empId, date = "") => {
    if (!empId) return;
    setLoadingRecs(true);
    Promise.all([
      getAttendance(empId, date || undefined),
      getAttendanceSummary(empId),
    ])
      .then(([r, s]) => {
        setRecords(r.data);
        setSummary(s.data);
      })
      .catch(() => setError("Failed to load attendance records."))
      .finally(() => setLoadingRecs(false));
  };

  const handleSelectEmployee = (id) => {
    setSelectedEmp(id);
    setFilterDate("");
    setRecords([]);
    setSummary(null);
    setFormError("");
    setSuccess("");
    if (id) loadRecords(id);
  };

  const handleFilterDate = (d) => {
    setFilterDate(d);
    loadRecords(selectedEmp, d);
  };

  const handleMark = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await markAttendance({ employee_id: selectedEmp, ...form });
      const emp = employees.find((e) => e.employee_id === selectedEmp);
      setSuccess(`Attendance marked as ${form.status} for ${emp?.full_name} on ${form.date}.`);
      loadRecords(selectedEmp, filterDate);
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to mark attendance.");
    } finally {
      setSaving(false);
    }
  };

  const selectedEmpObj = employees.find((e) => e.employee_id === selectedEmp);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
      <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">
  Attendance
</h1>

<p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
  Mark and review daily attendance records
</p> </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {/* Step 1: Select Employee */}
      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Step 1 · Select Employee
        </h2>

        {loadingEmps ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Spinner size="sm" /> Loading employees…
          </div>
        ) : employees.length === 0 ? (
          <p className="text-slate-500 text-sm">No employees found. Add employees first.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
            {employees.map((emp) => (
              <button
                key={emp.employee_id}
                onClick={() => handleSelectEmployee(emp.employee_id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150
                  ${selectedEmp === emp.employee_id
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "bg-slate-800/40 border-slate-700/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70"
                  }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-display shrink-0
                  ${selectedEmp === emp.employee_id
                    ? "bg-indigo-500/30 text-indigo-300"
                    : "bg-slate-700 text-slate-400"
                  }`}>
                  {emp.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate">{emp.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{emp.department}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedEmp && (
        <>
          {/* Summary cards */}
          {summary && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Days Logged", value: summary.total_days,   color: "text-indigo-400",  bg: "bg-indigo-500/10 border-indigo-500/20" },
                { label: "Present Days",       value: summary.present_days, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { label: "Absent Days",        value: summary.absent_days,  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
                  <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Mark Attendance */}
          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Step 2 · Mark Attendance for <span className="text-indigo-300">{selectedEmpObj?.full_name}</span>
            </h2>

            <SuccessBanner message={success} onDismiss={() => setSuccess("")} />
            <ErrorBanner message={formError} onDismiss={() => setFormError("")} />

            <form onSubmit={handleMark} className="flex flex-wrap items-end gap-4">
              <div>
                <label className="label">Date *</label>
                <input
                  type="date"
                  className="input w-48"
                  value={form.date}
                  max={today()}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Status *</label>
                <div className="flex gap-2">
                  {["Present", "Absent"].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setForm({ ...form, status: s })}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150
                        ${form.status === s
                          ? s === "Present"
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-red-500/20 border-red-500/40 text-red-300"
                          : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-600"
                        }`}
                    >
                      {s === "Present" ? "✅" : "❌"} {s}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary flex items-center gap-2 mb-0" disabled={saving}>
                {saving ? <Spinner size="sm" /> : null}
                Mark Attendance
              </button>
            </form>
          </div>

          {/* Step 3: View Records */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/40 flex-wrap gap-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Attendance Records
              </h2>
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-500">Filter by date:</label>
                <input
                  type="date"
                  className="input !w-44 !py-1.5"
                  value={filterDate}
                  max={today()}
                  onChange={(e) => handleFilterDate(e.target.value)}
                />
                {filterDate && (
                  <button
                    className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    onClick={() => handleFilterDate("")}
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingRecs ? (
                  <LoadingRows cols={3} rows={4} />
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <EmptyState
                        icon="📅"
                        title={filterDate ? "No records for this date" : "No attendance records yet"}
                        subtitle={filterDate ? "Try a different date" : "Mark attendance above to get started"}
                      />
                    </td>
                  </tr>
                ) : (
                  records.map((rec, i) => {
                    const d = new Date(rec.date + "T00:00:00");
                    return (
                      <tr
                        key={rec.id}
                        className="border-b border-slate-700/20 hover:bg-slate-800/20 transition-colors animate-fade-up"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-slate-300">{rec.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400">
                            {d.toLocaleDateString("en-US", { weekday: "long" })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {rec.status === "Present" ? (
                            <span className="badge-present">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                              Present
                            </span>
                          ) : (
                            <span className="badge-absent">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                              Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!selectedEmp && !loadingEmps && employees.length > 0 && (
        <div className="card">
          <EmptyState
            icon="👆"
            title="Select an employee above"
            subtitle="Choose an employee to view and mark their attendance"
          />
        </div>
      )}
    </div>
  );
}
