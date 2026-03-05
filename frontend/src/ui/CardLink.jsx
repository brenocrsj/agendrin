import { Link } from "react-router-dom";

export default function CardLink({ to, title, subtitle, right, className = "" }) {
  return (
    <Link
      to={to}
      className={[
        "group block rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition",
        "hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50",
        "focus:outline-none focus:ring-2 focus:ring-copper-300",
        className
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-extrabold text-slate-900 group-hover:text-slate-900">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
          ) : null}
        </div>

        {right ? <div className="text-slate-500">{right}</div> : null}
      </div>
    </Link>
  );
}