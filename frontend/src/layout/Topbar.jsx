import { Bell, Search, ChevronDown, UserCircle2 } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-6 py-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="relative max-w-[520px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Pesquise..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-9 py-2 text-sm outline-none focus:bg-white focus:border-slate-300"
            />
          </div>
        </div>

        <button className="rounded-2xl border border-slate-200 bg-white p-2 hover:bg-slate-50">
          <Bell size={18} className="text-slate-600" />
        </button>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <UserCircle2 size={20} className="text-slate-500" />
          <div className="text-xs leading-tight">
            <div className="font-semibold text-slate-900">BRENO CARLOS</div>
            <div className="text-slate-500">Acordes Barbearia</div>
          </div>
          <ChevronDown size={16} className="text-slate-500" />
        </div>
      </div>
    </header>
  );
}