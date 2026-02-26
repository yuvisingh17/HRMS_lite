// ── Spinner ────────────────────────────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return (
    <svg
      className={`${s} animate-spin text-indigo-400`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ── LoadingOverlay ─────────────────────────────────────────────────────────────
export function LoadingRows({ cols = 4, rows = 4 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-slate-700/30">
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} className="px-5 py-4">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  ));
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 opacity-40">{icon}</div>
      <p className="text-slate-300 font-semibold font-display text-lg">{title}</p>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

// ── ErrorBanner ────────────────────────────────────────────────────────────────
export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 text-red-300 rounded-xl px-4 py-3 text-sm animate-fade-up">
      <span className="text-lg leading-none mt-0.5">⚠️</span>
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400/60 hover:text-red-300 transition-colors leading-none text-base">
          ✕
        </button>
      )}
    </div>
  );
}

// ── SuccessBanner ──────────────────────────────────────────────────────────────
export function SuccessBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 rounded-xl px-4 py-3 text-sm animate-fade-up">
      <span className="text-lg leading-none mt-0.5">✓</span>
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-emerald-400/60 hover:text-emerald-300 transition-colors leading-none text-base">
          ✕
        </button>
      )}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="relative card p-6 w-full max-w-md shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold font-display text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = "indigo", loading }) {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    amber:   "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400",
    red:     "from-red-500/20 to-red-600/5 border-red-500/20 text-red-400",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      {loading ? (
        <div className="skeleton h-8 w-16 rounded mb-2" />
      ) : (
        <p className="text-3xl font-bold font-display text-white">{value}</p>
      )}
      <p className="text-sm text-slate-400 font-medium mt-1">{label}</p>
    </div>
  );
}

// ── ConfirmDialog ──────────────────────────────────────────────────────────────
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-slate-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white font-semibold px-5 py-2.5 rounded-xl
                     transition-all duration-200 active:scale-95 disabled:opacity-50 text-sm
                     shadow-lg shadow-red-500/20 flex items-center gap-2"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <Spinner size="sm" />}
          Delete
        </button>
      </div>
    </Modal>
  );
}
