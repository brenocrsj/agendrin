import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Table from "../ui/Table";
import { api } from "../services/api";

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/scheduling/customers/");
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
  }

  function openNewCustomerModal() {
    resetForm();
    setOpenModal(true);
  }

  async function handleCreateCustomer() {
    if (!name.trim() || !phone.trim()) {
      setError("Preencha pelo menos nome e telefone.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await api.post("/api/scheduling/customers/", {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });

      setOpenModal(false);
      resetForm();
      await loadCustomers();
    } catch (err) {
      setError("Não foi possível cadastrar o cliente.");
    } finally {
      setSaving(false);
    }
  }

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter((customer) => {
      const nameMatch = (customer.name || "").toLowerCase().includes(q);
      const phoneMatch = (customer.phone || "").toLowerCase().includes(q);
      const emailMatch = (customer.email || "").toLowerCase().includes(q);
      return nameMatch || phoneMatch || emailMatch;
    });
  }, [customers, search]);

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "E-mail" },
    { key: "criado", label: "Criado em" },
  ];

  const rows = filteredCustomers.map((customer) => ({
    nome: customer.name || "-",
    telefone: customer.phone || "-",
    email: customer.email || "-",
    criado: formatDate(customer.created_at),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="page-title">Clientes</div>
          <div className="page-subtitle">
            Cadastro, relacionamento e histórico dos seus clientes.
          </div>
        </div>

        <Button onClick={openNewCustomerModal}>
          <Plus size={16} />
          Novo cliente
        </Button>
      </div>

      {error ? (
        <div className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="section-card p-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="form-control pl-11"
            placeholder="Buscar por nome, telefone ou e-mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="section-card">
        {loading ? (
          <div className="text-sm text-slate-500">Carregando clientes...</div>
        ) : rows.length > 0 ? (
          <Table columns={columns} rows={rows} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-copper-50 text-copper-700">
              <Users size={24} />
            </div>
            <div className="mt-4 text-lg font-bold text-slate-900">Nenhum cliente cadastrado</div>
            <div className="mt-2 max-w-md text-sm text-slate-500">
              Cadastre seu primeiro cliente para começar a usar a agenda e organizar o atendimento.
            </div>
            <Button className="mt-5" onClick={openNewCustomerModal}>
              <Plus size={16} />
              Cadastrar cliente
            </Button>
          </div>
        )}
      </div>

      <Modal
        open={openModal}
        title="Novo cliente"
        onClose={() => setOpenModal(false)}
      >
        <div className="grid gap-4">
          <div>
            <label className="form-label">Nome</label>
            <input
              className="form-control"
              placeholder="Nome do cliente"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Telefone</label>
            <input
              className="form-control"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              placeholder="cliente@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpenModal(false)}>
            Fechar
          </Button>
          <Button onClick={handleCreateCustomer} disabled={saving}>
            {saving ? "Salvando..." : "Cadastrar cliente"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}