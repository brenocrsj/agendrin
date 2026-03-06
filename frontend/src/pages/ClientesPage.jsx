import { Plus, Search } from "lucide-react";
import Button from "../ui/Button";
import Table from "../ui/Table";

export default function ClientesPage() {
  const columns = [
    { key: "nome", label: "Nome" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "criado", label: "Criado em" },
  ];

  const rows = [
    { nome: "Maria Souza", telefone: "(11) 99999-9999", email: "maria@email.com", criado: "Jan/2026" },
    { nome: "João Lima", telefone: "(11) 98888-8888", email: "joao@email.com", criado: "Fev/2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="page-title">Clientes</div>
          <div className="page-subtitle">Cadastro, relacionamento e histórico.</div>
        </div>
        <Button variant="primary">
          <Plus size={16} />
          Novo cliente
        </Button>
      </div>

      <div className="section-card p-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="form-control pl-11" placeholder="Buscar cliente por nome, e-mail ou telefone" />
        </div>
      </div>

      <Table columns={columns} rows={rows} />
    </div>
  );
}