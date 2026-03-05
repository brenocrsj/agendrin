import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users,
  Scissors,
  UserRound,
  Wallet,
  Settings,
  Link as LinkIcon
} from "lucide-react";

const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`
    }
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-[260px] border-r border-slate-200 bg-white">
      <div className="px-5 py-5">
        <div className="text-xl font-extrabold tracking-tight text-slate-900">
          agendrin
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Sistema de Agendamento
        </div>
      </div>

      <div className="px-3 pb-6">
        <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase mt-2 mb-2">
          Menu
        </div>

        <div className="space-y-1">
          <Item to="/app/inicio" icon={Home} label="Início" />
          <Item to="/app/agenda" icon={CalendarDays} label="Agenda" />
          <Item to="/app/clientes" icon={Users} label="Clientes" />
          <Item to="/app/servicos" icon={Scissors} label="Serviços" />
          <Item to="/app/profissionais" icon={UserRound} label="Profissionais" />
          <Item to="/app/financeiro" icon={Wallet} label="Financeiro" />
          <Item to="/app/configuracoes" icon={Settings} label="Configurações" />
        </div>

        <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase mt-6 mb-2">
          Link de Agendamento
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <LinkIcon size={14} />
            <span className="font-semibold">Seu link</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 break-all">
            https://agendrin.com.br/suaempresa
          </div>
          <button className="mt-3 w-full rounded-xl bg-white border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Configurar
          </button>
        </div>
      </div>
    </aside>
  );
}