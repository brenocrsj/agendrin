import { Bell, Search, ChevronDown, UserCircle2, Menu } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 rounded-[28px] border border-white/70 bg-white/85 px-4 py-3 shadow-soft backdrop-blur sm:px-5">
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-copper-200 hover:bg-copper-50 hover:text-copper-800 xl:hidden">
          <Menu size={18} />
        </button>

        <div className="flex-1">
          <div className="relative max-w-[560px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Pesquise clientes, serviços ou agendamentos..."
              className="form-control pl-11 pr-4"
            />
          </div>
        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-copper-200 hover:bg-copper-50 hover:text-copper-800">
          <Bell size={18} />
        </button>

        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 px-3 py-2.5 shadow-sm sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-copper-50 text-copper-700">
            <UserCircle2 size={20} />
          </div>
          <div className="text-xs leading-tight">
            <div className="font-semibold uppercase tracking-[0.14em] text-slate-400">Conta</div>
            <div className="mt-1 font-bold text-slate-900">BRENO CARLOS</div>
            <div className="text-slate-500">Acordes Barbearia</div>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}