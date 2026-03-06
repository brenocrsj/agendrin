import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users,
  Scissors,
  UserRound,
  Wallet,
  Settings,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
        isActive
          ? "border border-copper-200 bg-copper-50/80 text-copper-900 shadow-sm"
          : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900"
      }`
    }
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition group-hover:text-copper-700">
      <Icon size={18} />
    </span>
    <span className="font-semibold">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="hidden xl:flex xl:w-[290px] xl:flex-col xl:p-5">
      <div className="glass-panel sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col rounded-[30px] bg-white/80 p-4">
        <div className="rounded-[26px] border border-copper-100 bg-gradient-to-br from-white via-white to-copper-50/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-copper-600 text-white shadow-lg shadow-copper-600/20">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900">agendrin</div>
              <div className="mt-1 text-xs text-slate-500">Gestão de agenda moderna</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
          <div>
            <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navegação
            </div>

            <div className="mt-3 space-y-2">
              <Item to="/app/inicio" icon={Home} label="Início" />
              <Item to="/app/agenda" icon={CalendarDays} label="Agenda" />
              <Item to="/app/clientes" icon={Users} label="Clientes" />
              <Item to="/app/servicos" icon={Scissors} label="Serviços" />
              <Item to="/app/profissionais" icon={UserRound} label="Profissionais" />
              <Item to="/app/financeiro" icon={Wallet} label="Financeiro" />
              <Item to="/app/configuracoes" icon={Settings} label="Configurações" />
            </div>
          </div>

          <div>
            <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Link público
            </div>

            <div className="mt-3 rounded-[26px] border border-copper-100 bg-gradient-to-br from-copper-50 to-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-copper-900">
                <LinkIcon size={14} />
                <span>Seu link de agendamento</span>
              </div>
              <div className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-xs text-slate-500 break-all border border-white shadow-sm">
                https://agendrin.com.br/suaempresa
              </div>
              <button className="mt-4 w-full rounded-2xl border border-copper-200 bg-white px-4 py-3 text-sm font-semibold text-copper-800 transition hover:-translate-y-0.5 hover:border-copper-300 hover:bg-copper-50">
                Configurar link
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}