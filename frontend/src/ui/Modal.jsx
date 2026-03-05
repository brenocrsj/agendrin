export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div className="text-xl font-extrabold text-slate-900">{title}</div>
          <button
            className="rounded-xl px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}