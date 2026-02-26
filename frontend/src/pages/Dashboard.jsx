import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, getEmployees } from "../api/api";
import { StatCard, ErrorBanner, LoadingRows } from "../components/UI";

export default function Dashboard() {
  const [stats, setStats]       = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    Promise.all([getDashboardStats(), getEmployees()])
      .then(([s, e]) => {
        setStats(s.data);
        setEmployees(e.data.slice(0, 5));
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div><h1 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">
  Dashboard
</h1>
        <p className="text-slate-500 dark:text-slate-300 text-sm mt-1">
  {today}
</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={stats?.total_employees ?? 0}   icon="👥" color="indigo"  loading={loading} />
        <StatCard label="Departments"      value={stats?.departments ?? 0}        icon="🏢" color="amber"   loading={loading} />
        <StatCard label="Present Today"    value={stats?.present_today ?? 0}      icon="✅" color="emerald" loading={loading} />
        <StatCard label="Absent Today"     value={stats?.absent_today ?? 0}       icon="❌" color="red"     loading={loading} />
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          to="/employees"
          className="card p-5 hover:border-indigo-500/30 transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20
                            flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👥
            </div>
            <div>
              <p className="font-semibold font-display text-white group-hover:text-indigo-300 transition-colors">
                Manage Employees
              </p>
              <p className="text-slate-500 text-sm">Add, view or remove employees</p>
            </div>
          </div>
        </Link>

        <Link
          to="/attendance"
          className="card p-5 hover:border-indigo-500/30 transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                            flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📋
            </div>
            <div>
              <p className="font-semibold font-display text-white group-hover:text-emerald-300 transition-colors">
                Mark Attendance
              </p>
              <p className="text-slate-500 text-sm">Track daily employee attendance</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent employees */}
      {/* <div className="card overflow-hidden"> */}
      <div className="table-container">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/40">
          <h2 className="font-semibold font-display text-white">Recent Employees</h2>
          <Link to="/employees" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/30">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRows cols={3} rows={3} />
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No employees yet. <Link to="/employees" className="text-indigo-400 hover:underline">Add one →</Link>
                </td>
              </tr>
            ) : (
              employees.map((emp, i) => (
                <tr
                  key={emp.employee_id}
                  className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30
                                      border border-indigo-500/20 flex items-center justify-center text-xs
                                      font-bold text-indigo-300 font-display">
                        {emp.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
  {emp.full_name}
</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                  <span className="font-mono text-xs 
                 text-slate-600 bg-slate-100 border border-slate-200
                 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700
                 px-2 py-1 rounded-md">
                      {emp.employee_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                  <span className="text-sm 
                 text-slate-700 bg-slate-100 border border-slate-200
                 dark:text-slate-300 dark:bg-slate-800/60 dark:border-slate-700
                 px-2.5 py-0.5 rounded-lg">
                      {emp.department}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
