export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-copper-100 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-copper-600 text-white shadow-lg shadow-copper-600/20 hover:-translate-y-0.5 hover:bg-copper-700",
    secondary:
      "border border-slate-200 bg-white text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-copper-200 hover:bg-copper-50 hover:text-copper-800",
    danger:
      "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800",
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}