import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus2, Copy, ExternalLink, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { api } from "../services/api";

export default function DashboardPage() {
  const nav = useNavigate();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    api
      .get("/api/core/tenant/me/")
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="badge-copper">
            <Sparkles size={14} />
            Visão geral
          </div>
          <div className="page-title mt-4">Bem-vindo ao painel</div>
          <div className="page-subtitle">
            Empresa: <span className="font-semibold text-slate-700">{tenant?.name || "Carregando..."}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => nav("/app/agenda?novo=1")}>
            <CalendarPlus2 size={16} />
            Novo agendamento
          </Button>
          <Button variant="secondary" onClick={() => nav("/app/clientes")}>Clientes</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Agendamentos" value="24" hint="Resumo ilustrativo do dia" />
        <Card title="Clientes ativos" value="128" hint="Base em crescimento" />
        <Card title="Taxa de ocupação" value="82%" hint="Bom aproveitamento da agenda" />
      </div>

      <div className="section-card overflow-hidden bg-gradient-to-r from-white via-white to-copper-50/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-slate-900">Acesso rápido</div>
            <div className="mt-1 text-sm text-slate-500">Atalhos para as ações mais frequentes.</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => nav("/app/agenda?novo=1")}>Novo agendamento</Button>
            <Button variant="secondary" onClick={() => nav("/app/agenda")}>Abrir agenda</Button>
            <Button variant="secondary" onClick={() => nav("/app/clientes")}>Ver clientes</Button>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-slate-900">Link de agendamento</div>
            <div className="mt-1 text-sm text-slate-500">
              Compartilhe com seus clientes para permitir agendamentos online.
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(bookingLink)}>
              <Copy size={16} />
              Copiar
            </Button>
            <Button variant="secondary" onClick={() => window.open(bookingLink, "_blank")}>
              <ExternalLink size={16} />
              Abrir
            </Button>
            <Button onClick={() => nav("/app/configuracoes")}>Configurar</Button>
          </div>
        </div>

        <div className="mt-5">
          <input className="form-control" value={bookingLink} readOnly />
        </div>
      </div>
    </div>
  );
}