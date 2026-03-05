import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { api } from "../services/api";

export default function DashboardPage() {
  const nav = useNavigate();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    api.get("/api/core/tenant/me/")
      .then(({ data }) => setTenant(data))
      .catch(() => {});
  }, []);

  const bookingLink = useMemo(() => {
    const origin = window.location.origin;
    const slug = tenant?.slug || "meu-cliente";
    return `${origin}/u/${slug}`;
  }, [tenant]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-3xl font-extrabold tracking-tight text-slate-900">
          Seja bem-vindo
        </div>
        <div className="mt-1 text-slate-600">
          Empresa: <span className="font-semibold">{tenant?.name || "..."}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-lg font-bold text-slate-900">⚡ Acesso Rápido</div>
            <div className="text-sm text-slate-500">Atalhos para ações comuns</div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => nav("/app/agenda?novo=1")}>Novo Agendamento</Button>
            <Button variant="secondary" onClick={() => nav("/app/agenda")}>Agenda</Button>
            <Button variant="secondary" onClick={() => nav("/app/clientes")}>Clientes</Button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-lg font-bold text-slate-900">🔗 Link de Agendamento</div>
            <div className="text-sm text-slate-500">
              Seus clientes acessam este link para agendar serviços.
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(bookingLink)}
            >
              Copiar
            </Button>
            <Button variant="secondary" onClick={() => window.open(bookingLink, "_blank")}>
              Abrir
            </Button>
            <Button onClick={() => nav("/app/configuracoes")}>Configurar</Button>
          </div>
        </div>

        <div className="mt-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-300"
            value={bookingLink}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}