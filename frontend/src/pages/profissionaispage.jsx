import Button from "../ui/Button";
import Table from "../ui/Table";

export default function ProfissionaisPage() {
  const columns = [
    { key: "nome", label: "Nome" },
    { key: "especialidade", label: "Especialidade" },
    { key: "status", label: "Status" }
  ];

  const rows = [
    { nome: "Carlos", especialidade: "Corte / Barba", status: "Ativo" },
    { nome: "Bruna", especialidade: "Manicure", status: "Ativo" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Profissionais</div>
          <div className="mt-1 text-sm text-slate-400">Equipe e disponibilidade.</div>
        </div>
        <Button variant="primary">Novo profissional</Button>
      </div>

      <Table columns={columns} rows={rows} />
    </div>
  );
}