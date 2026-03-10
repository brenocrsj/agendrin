import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { api } from "../services/api";

export default function DashboardPage() {
  const nav = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [metrics, setMetrics] = useState({
    appointmentsToday: 0,
    customers: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const now = new Date();

      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");

      const startToday = `${yyyy}-${mm}-${dd}T00:00:00`;
      const endToday = `${yyyy}-${mm}-${dd}T23:59:59`;

      const startMonth = `${yyyy}-${mm}-01T00:00:00`;
      const endMonth = `${yyyy}-${mm}-31T23:59:59`;

      const [tenantRes, customersRes, appointmentsRes, financeRes] = await Promise.all([
        api.get("/api/core/tenant/me/"),
        api.get("/api/scheduling/customers/"),
        api.get("/api/scheduling/appointments/", {
          params: { from: startToday, to: endToday },
        }),
        api.get("/api/finance/transactions/", {
          params: { from: startMonth, to: endMonth },
        }),
      ]);

      const transactions = financeRes.data || [];
      const monthlyRevenue = transactions
        .filter((t) => t.type === "IN")
        .reduce((acc, item) => acc + (item.amount_cents || 0), 0);

      setTenant(tenantRes.data);
      setMetrics({
        appointmentsToday: (appointmentsRes.data || []).length,
        customers: (customersRes.data || []).length,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  }

  const bookingLink = useMemo(() => {
    const origin = window.location.origin;
    const slug = tenant?.slug || "meu-cliente";
    return `${origin}/u/${slug}`;
  }, [tenant]);

  function formatMoney(cents) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format((cents || 0) / 100);
  }

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Agendamentos hoje"
          value={String(metrics.appointmentsToday)}
          hint="Total de agendamentos do dia"
        />
        <Card
          title="Clientes cadastrados"
          value={String(metrics.customers)}
          hint="Total de clientes no sistema"
        />
        <Card
          title="Entradas no mês"
          value={formatMoney(metrics.monthlyRevenue)}
          hint="Receita de transações de entrada"
        />
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