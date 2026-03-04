export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = ""
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition border";

  const variants = {
    primary: "bg-white text-slate-900 border-white hover:bg-slate-200",
    secondary: "bg-slate-900/60 text-white border-slate-800 hover:bg-slate-900",
    danger: "bg-red-600 text-white border-red-600 hover:bg-red-700"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}