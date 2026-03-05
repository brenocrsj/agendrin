import Button from "../ui/Button";
import Table from "../ui/Table";

export default function AgendaPage() {
  const columns = [
    { key: "data", label: "Data" },
    { key: "hora", label: "Hora" },
    { key: "cliente", label: "Cliente" },
    { key: "profissional", label: "Profissional" },
    { key: "servico", label: "Serviço" },
    { key: "status", label: "Status" }
  ];

  const rows = [
    { data: "04/03", hora: "09:00", cliente: "Maria", profissional: "Carlos", servico: "Corte", status: "Confirmado" },
    { data: "04/03", hora: "10:30", cliente: "João", profissional: "Carlos", servico: "Barba", status: "Pendente" },
    { data: "04/03", hora: "13:00", cliente: "Ana", profissional: "Bruna", servico: "Manicure", status: "Confirmado" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Agenda</div>
          <div className="mt-1 text-sm text-slate-400">Gerencie agendamentos e confirmações.</div>
        </div>
        <Button variant="primary">Novo agendamento</Button>
      </div>

      <Table columns={columns} rows={rows} />
    </div>
  );
}