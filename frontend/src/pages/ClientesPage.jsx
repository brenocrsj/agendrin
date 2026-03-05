import Button from "../ui/Button";
import Table from "../ui/Table";

export default function ClientesPage() {
  const columns = [
    { key: "nome", label: "Nome" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "criado", label: "Criado em" }
  ];

  const rows = [
    { nome: "Maria Souza", telefone: "(11) 99999-9999", email: "maria@email.com", criado: "Jan/2026" },
    { nome: "João Lima", telefone: "(11) 98888-8888", email: "joao@email.com", criado: "Fev/2026" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Clientes</div>
          <div className="mt-1 text-sm text-slate-400">Cadastro e histórico.</div>
        </div>
        <Button variant="primary">Novo cliente</Button>
      </div>

      <Table columns={columns} rows={rows} />
    </div>
  );
}