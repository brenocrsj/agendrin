import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-[30px] border border-white/80 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900">{title}</div>
            <div className="mt-1 text-sm text-slate-500">Preencha os dados abaixo para continuar.</div>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-copper-200 hover:bg-copper-50 hover:text-copper-800"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}