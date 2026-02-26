import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const links = [
  { to: "/", label: "Dashboard", icon: "⬡" },
  { to: "/employees", label: "Employees", icon: "👥" },
  { to: "/attendance", label: "Attendance", icon: "📋" },
];

export default function Layout({ children }) {
  const [dark, setDark] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r 
                        bg-white border-slate-200
                        dark:bg-slate-900/80 dark:border-slate-800
                        backdrop-blur-xl flex flex-col fixed h-full z-40">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight dark:text-white">
                HRMS Lite
              </p>
              <p className="text-slate-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60"
                }`
              }
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">

        {/* Top bar */}
        <header
  className="sticky top-0 z-30
             bg-white border-b border-slate-200
             dark:bg-slate-950/80 dark:border-slate-800
             backdrop-blur-xl px-8 py-4
             flex items-center justify-end gap-6"
>

  {/* Premium Theme Button */}
  <button
  onClick={() => setDark(!dark)}
  className="relative w-16 h-8 flex items-center rounded-full p-1
             transition-all duration-500
             bg-slate-200 dark:bg-slate-800
             shadow-inner"
>
  {/* Background Gradient */}
  <div
    className={`absolute inset-0 rounded-full transition-all duration-500
      ${
        dark
        ? "bg-gradient-to-r from-indigo-500 to-purple-600"
        : "bg-gradient-to-r from-indigo-400 to-indigo-500"
         }
    `}
  />

  {/* Sliding Circle */}
  <div
    className={`relative z-10 w-6 h-6 rounded-full bg-white
                flex items-center justify-center
                shadow-md transform transition-all duration-500
                ${dark ? "translate-x-8" : "translate-x-0"}
    `}
  >
    {/* SHOW NEXT MODE ICON */}
    {dark ? "☀️" : "🌙"}
  </div>
</button>
</header>
        {/* Page content */}
        <div className="p-8 animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
}