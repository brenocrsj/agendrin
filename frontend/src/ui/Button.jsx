export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-copper-300";

  const variants = {
    primary: "bg-copper-600 text-white hover:bg-copper-700",
    secondary: "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}