import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Scissors } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Table from "../ui/Table";
import { api } from "../services/api";

function formatMoney(cents) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format((cents || 0) / 100);
}

function formatMinutes(value) {
  if (!value && value !== 0) return "-";
  return `${value} min`;
}

export default function ServicosPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [durationMin, setDurationMin] = useState("30");
  const [priceCents, setPriceCents] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/scheduling/services/");
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Não foi possível carregar os serviços.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDurationMin("30");
    setPriceCents("");
  }

  function openNewServiceModal() {
    resetForm();
    setOpenModal(true);
  }

  async function handleCreateService() {
    if (!name.trim()) {
      setError("Informe o nome do serviço.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await api.post("/api/scheduling/services/", {
        name: name.trim(),
        duration_min: Number(durationMin || 0),
        price_cents: Number(priceCents || 0),
      });

      setOpenModal(false);
      resetForm();
      await loadServices();
    } catch (err) {
      setError("Não foi possível cadastrar o serviço.");
    } finally {
      setSaving(false);
    }
  }

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;

    return services.filter((service) =>
      (service.name || "").toLowerCase().includes(q)
    );
  }, [services, search]);

  const columns = [
    { key: "nome", label: "Serviço" },
    { key: "duracao", label: "Duração" },
    { key: "preco", label: "Preço" },
  ];

  const rows = filteredServices.map((service) => ({
    nome: service.name || "-",
    duracao: formatMinutes(service.duration_min),
    preco: formatMoney(service.price_cents),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="page-title">Serviços</div>
          <div className="page-subtitle">
            Cadastre e organize os serviços oferecidos pelo seu negócio.
          </div>
        </div>

        <Button onClick={openNewServiceModal}>
          <Plus size={16} />
          Novo serviço
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
            placeholder="Buscar serviço por nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="section-card">
        {loading ? (
          <div className="text-sm text-slate-500">Carregando serviços...</div>
        ) : rows.length > 0 ? (
          <Table columns={columns} rows={rows} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-copper-50 text-copper-700">
              <Scissors size={24} />
            </div>
            <div className="mt-4 text-lg font-bold text-slate-900">Nenhum serviço cadastrado</div>
            <div className="mt-2 max-w-md text-sm text-slate-500">
              Cadastre seu primeiro serviço para começar a montar sua agenda.
            </div>
            <Button className="mt-5" onClick={openNewServiceModal}>
              <Plus size={16} />
              Cadastrar serviço
            </Button>
          </div>
        )}
      </div>

      <Modal
        open={openModal}
        title="Novo serviço"
        onClose={() => setOpenModal(false)}
      >
        <div className="grid gap-4">
          <div>
            <label className="form-label">Nome do serviço</label>
            <input
              className="form-control"
              placeholder="Ex: Corte masculino"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Duração (minutos)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="30"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Preço em centavos</label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="3500"
              value={priceCents}
              onChange={(e) => setPriceCents(e.target.value)}
            />
            <div className="mt-2 text-xs text-slate-500">
              Exemplo: R$ 35,00 = 3500
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpenModal(false)}>
            Fechar
          </Button>
          <Button onClick={handleCreateService} disabled={saving}>
            {saving ? "Salvando..." : "Cadastrar serviço"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}