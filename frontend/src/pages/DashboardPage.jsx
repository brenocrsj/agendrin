import Card from "../ui/Card";
import Table from "../ui/Table";

export default function DashboardPage() {
  const kpis = [
    { title: "Agendamentos Hoje", value: "8", subtitle: "2 pendentes • 6 confirmados" },
    { title: "Clientes", value: "124", subtitle: "+12 este mês" },
    { title: "Profissionais", value: "4", subtitle: "Todos ativos" },
    { title: "Receita (mês)", value: "R$ 7.320", subtitle: "↑ 18% vs mês anterior" }
  ];

  const columns = [
    { key: "hora", label: "Hora" },
    { key: "cliente", label: "Cliente" },
    { key: "servico", label: "Serviço" },
    { key: "status", label: "Status" }
  ];

  const rows = [
    { hora: "09:00", cliente: "Maria Souza", servico: "Corte", status: "Confirmado" },
    { hora: "10:30", cliente: "João Lima", servico: "Barba", status: "Pendente" },
    { hora: "13:00", cliente: "Ana Silva", servico: "Manicure", status: "Confirmado" },
    { hora: "15:00", cliente: "Pedro Santos", servico: "Sobrancelha", status: "Confirmado" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="mt-1 text-sm text-slate-400">Visão geral do seu negócio hoje.</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.title} title={k.title} value={k.value} subtitle={k.subtitle} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="text-base font-semibold">Agenda do Dia</div>
        <div className="mt-1 text-sm text-slate-400">Próximos horários</div>
        <div className="mt-4">
          <Table columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  );
}