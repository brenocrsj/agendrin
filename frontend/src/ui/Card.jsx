export default function Card({ title, value, hint }) {
  return (
    <div className="rounded-[26px] border border-slate-200/80 bg-white/90 p-5 shadow-soft backdrop-blur">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
      {hint ? <div className="mt-2 text-sm text-slate-500">{hint}</div> : null}
    </div>
  );
}