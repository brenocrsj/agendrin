import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  UserCircle2,
  CalendarDays,
  Users,
  Scissors,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api } from "../services/api";

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");

      const from = `${yyyy}-${mm}-${dd}T00:00:00`;
      const to = `${yyyy}-${mm}-${dd}T23:59:59`;

      const { data } = await api.get("/api/scheduling/appointments/", {
        params: { from, to },
      });

      const items = (data || []).slice(0, 5).map((item) => ({
        id: item.id,
        title: item.customer_name || "Agendamento",
        description: `${formatTime(item.starts_at)} • ${item.service_name || "Serviço"}`,
      }));

      setNotifications(items);
    } catch {
      setNotifications([]);
    }
  }

  function formatTime(value) {
    try {
      return new Date(value).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  }

  const searchSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];

    const items = [
      { label: "Ir para Agenda", keywords: ["agenda", "agendamento", "horario"], path: "/app/agenda", icon: CalendarDays },
      { label: "Ir para Clientes", keywords: ["cliente", "clientes"], path: "/app/clientes", icon: Users },
      { label: "Ir para Serviços", keywords: ["servico", "serviços", "servicos"], path: "/app/servicos", icon: Scissors },
      { label: "Ir para Financeiro", keywords: ["financeiro", "caixa", "faturamento"], path: "/app/financeiro", icon: Wallet },
      { label: "Ir para Configurações", keywords: ["configuracao", "configurações", "configuracoes", "conta", "plano"], path: "/app/configuracoes", icon: Settings },
    ];

    return items.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
    );
  }, [search]);

  function handleSearchSubmit(e) {
    e.preventDefault();

    const q = search.trim().toLowerCase();
    if (!q) return;

    if (q.includes("agenda")) return navigate("/app/agenda");
    if (q.includes("cliente")) return navigate("/app/clientes");
    if (q.includes("serv")) return navigate("/app/servicos");
    if (q.includes("prof")) return navigate("/app/profissionais");
    if (q.includes("finan")) return navigate("/app/financeiro");
    if (q.includes("config") || q.includes("conta") || q.includes("plano")) return navigate("/app/configuracoes");
  }

  function handleLogout() {
    logout();
    navigate("/entrar");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-6 py-3">
        <div className="relative flex-1">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative max-w-[520px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquise agenda, clientes, serviços, financeiro..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-9 py-2 text-sm outline-none focus:bg-white focus:border-slate-300"
              />
            </div>
          </form>

          {searchSuggestions.length > 0 && (
            <div className="absolute mt-2 w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              {searchSuggestions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSearch("");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
                  >
                    <Icon size={16} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-2xl border border-slate-200 bg-white p-2 hover:bg-slate-50"
          >
            <Bell size={18} className="text-slate-600" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-copper-600" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
              <div className="mb-2 text-sm font-semibold text-slate-900">Notificações</div>

              {notifications.length === 0 ? (
                <div className="text-sm text-slate-500">Nenhuma notificação no momento.</div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div className="text-sm font-medium text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2"
          >
            <UserCircle2 size={20} className="text-slate-500" />
            <div className="text-xs leading-tight text-left">
              <div className="font-semibold text-slate-900">
                {user?.first_name || "Usuário"}
              </div>
              <div className="text-slate-500">
                {user?.tenant?.name || "Empresa"}
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-[240px] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <button
                onClick={() => {
                  navigate("/app/configuracoes");
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
              >
                <Settings size={16} className="text-slate-500" />
                <span className="text-sm text-slate-700">Ver conta</span>
              </button>

              <button
                onClick={() => {
                  navigate("/app/configuracoes");
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
              >
                <Wallet size={16} className="text-slate-500" />
                <span className="text-sm text-slate-700">Ver plano</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-red-50"
              >
                <LogOut size={16} className="text-red-500" />
                <span className="text-sm text-red-600">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}