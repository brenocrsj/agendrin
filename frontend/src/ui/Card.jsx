export default function Card({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
      {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}