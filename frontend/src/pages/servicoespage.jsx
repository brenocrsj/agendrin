import Button from "../ui/Button";
import Table from "../ui/Table";

export default function ServicosPage() {
  const columns = [
    { key: "nome", label: "Serviço" },
    { key: "duracao", label: "Duração" },
    { key: "preco", label: "Preço" }
  ];

  const rows = [
    { nome: "Corte", duracao: "30 min", preco: "R$ 40" },
    { nome: "Barba", duracao: "30 min", preco: "R$ 35" },
    { nome: "Manicure", duracao: "45 min", preco: "R$ 60" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Serviços</div>
          <div className="mt-1 text-sm text-slate-400">Tabela de serviços e preços.</div>
        </div>
        <Button variant="primary">Novo serviço</Button>
      </div>

      <Table columns={columns} rows={rows} />
    </div>
  );
}