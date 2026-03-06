import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { api } from "../services/api";

function toDateInput(d) {
  return d.toISOString().slice(0, 10);
}
function toIsoLocal(dateStr, timeStr) {
  // cria ISO com timezone do browser
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0);
  return dt.toISOString();
}
function hhmm(iso) {
  const dt = new Date(iso);
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AgendaPage() {
  const [day, setDay] = useState(() => toDateInput(new Date()));

  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [appointments, setAppointments] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // modais
  const [openAppt, setOpenAppt] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);

  // form agendamento
  const [editingId, setEditingId] = useState(null);
  const [serviceId, setServiceId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [time, setTime] = useState("09:00");
  const [status, setStatus] = useState("CONFIRMED");

  // form bloqueio
  const [blockProfessionalId, setBlockProfessionalId] = useState("");
  const [blockStart, setBlockStart] = useState("12:00");
  const [blockEnd, setBlockEnd] = useState("13:00");
  const [blockReason, setBlockReason] = useState("Almoço");

  const range = useMemo(() => {
    // busca dia inteiro
    const from = `${day}T00:00:00`;
    const to = `${day}T23:59:59`;
    return { from, to };
  }, [day]);

  async function loadAll() {
    setError("");
    setLoading(true);
    try {
      const [s, p, c, a, b] = await Promise.all([
        api.get("/api/scheduling/services/"),
        api.get("/api/scheduling/professionals/"),
        api.get("/api/scheduling/customers/"),
        api.get("/api/scheduling/appointments/", { params: range }),
        api.get("/api/scheduling/timeblocks/", { params: range }),
      ]);

      setServices(s.data);
      setProfessionals(p.data);
      setCustomers(c.data);
      setAppointments(a.data);
      setBlocks(b.data);
    } catch (e) {
      setError("Não consegui carregar agenda. Verifique se você tem serviços/profissionais cadastrados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  function resetApptForm() {
    setEditingId(null);
    setServiceId("");
    setProfessionalId("");
    setCustomerId("");
    setTime("09:00");
    setStatus("CONFIRMED");
  }

  function openNewAppt() {
    resetApptForm();
    setOpenAppt(true);
  }

  function openEditAppt(appt) {
    setEditingId(appt.id);
    setServiceId(String(appt.service));
    setProfessionalId(String(appt.professional));
    setCustomerId(String(appt.customer));
    setTime(hhmm(appt.starts_at));
    setStatus(appt.status);
    setOpenAppt(true);
  }

  async function saveAppt() {
    setError("");
    if (!serviceId || !professionalId || !customerId) {
      setError("Selecione serviço, profissional e cliente.");
      return;
    }
    const starts_at = toIsoLocal(day, time);
    const payload = {
      service: Number(serviceId),
      professional: Number(professionalId),
      customer: Number(customerId),
      starts_at,
      status,
    };

    try {
      if (editingId) {
        await api.patch(`/api/scheduling/appointments/${editingId}/`, payload);
      } else {
        await api.post("/api/scheduling/appointments/", payload);
      }
      setOpenAppt(false);
      await loadAll();
    } catch (e) {
      setError(
        e?.response?.data?.detail ||
          (typeof e?.response?.data === "string" ? e.response.data : "") ||
          "Erro ao salvar agendamento (conflito ou dados inválidos)."
      );
    }
  }

  async function cancelAppt() {
    if (!editingId) return;
    try {
      await api.patch(`/api/scheduling/appointments/${editingId}/`, { status: "CANCELED" });
      setOpenAppt(false);
      await loadAll();
    } catch {
      setError("Não foi possível cancelar.");
    }
  }

  async function createBlock() {
    setError("");
    if (!blockProfessionalId) {
      setError("Selecione o profissional.");
      return;
    }
    const starts_at = toIsoLocal(day, blockStart);
    const ends_at = toIsoLocal(day, blockEnd);
    try {
      await api.post("/api/scheduling/timeblocks/", {
        professional: Number(blockProfessionalId),
        starts_at,
        ends_at,
        reason: blockReason,
      });
      setOpenBlock(false);
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.non_field_errors?.[0] || "Não foi possível bloquear (há conflito).");
    }
  }

  const todayLabel = useMemo(() => {
    return new Date(day).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }, [day]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08..19

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="page-title">Agenda</div>
          <div className="page-subtitle">{todayLabel}</div>
          <div className="mt-2">
            <input
              type="date"
              className="form-control max-w-[220px] py-2.5"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={openNewAppt}>Novo Agendamento</Button>
          <Button variant="danger" onClick={() => setOpenBlock(true)}>Bloquear Horário</Button>
          <Button variant="secondary" onClick={loadAll}>↻ Atualizar</Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="section-card">
        {loading ? (
          <div className="text-sm text-slate-500">Carregando...</div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
            <div className="data-grid-header grid grid-cols-[82px_1fr] border-b border-slate-200">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500">Hora</div>
              <div className="px-3 py-2 text-xs font-semibold text-slate-500">Agendamentos / Bloqueios</div>
            </div>

            <div className="grid grid-cols-[82px_1fr]">
              {hours.map((h) => {
                const hh = String(h).padStart(2, "0");
                const hourPrefix = `${hh}:`;
                const apptsHere = appointments.filter((a) => hhmm(a.starts_at).startsWith(hourPrefix));
                const blocksHere = blocks.filter((b) => hhmm(b.starts_at).startsWith(hourPrefix));

                return (
                  <div key={h} className="contents">
                    <div className="border-b border-slate-100 px-3 py-3 text-xs font-semibold text-slate-400">
                      {hh}:00
                    </div>
                    <div className="border-b border-slate-100 px-3 py-3 space-y-2.5">
                      {blocksHere.map((b) => (
                        <div
                          key={b.id}
                          className="rounded-[22px] border border-slate-800 bg-slate-900 text-white px-4 py-3 shadow-lg shadow-slate-900/10"
                        >
                          <div className="text-sm font-semibold">🚫 Bloqueado</div>
                          <div className="mt-1 text-xs opacity-90">
                            {hhmm(b.starts_at)} - {hhmm(b.ends_at)} • {b.reason || "Indisponível"}
                          </div>
                        </div>
                      ))}

                      {apptsHere.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => openEditAppt(a)}
                          className="w-full rounded-[22px] border border-copper-200 bg-gradient-to-r from-copper-600 to-copper-500 px-4 py-3 text-left text-white shadow-lg shadow-copper-600/20 transition hover:-translate-y-0.5"
                        >
                          <div className="text-sm font-semibold">
                            {a.customer_name || "Agendamento"}
                          </div>
                          <div className="mt-1 text-xs opacity-90">
                            {hhmm(a.starts_at)} - {hhmm(a.ends_at)} • status: {a.status}
                          </div>
                          <div className="mt-1 text-xs opacity-90">(clique para editar)</div>
                        </button>
                      ))}

                      {apptsHere.length === 0 && blocksHere.length === 0 ? (
                        <div className="text-xs font-medium text-slate-400">Livre</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={openAppt}
        title={editingId ? "Editar agendamento" : "Novo agendamento"}
        onClose={() => setOpenAppt(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="form-label">Serviço</div>
            <select
              className="form-select mt-2"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="form-label">Profissional</div>
            <select
              className="form-select mt-2"
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="form-label">Cliente</div>
            <select
              className="form-select mt-2"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>

          <div>
            <div className="form-label">Horário</div>
            <input
              type="time"
              className="form-select mt-2"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <div className="form-label">Status</div>
            <select
              className="form-select mt-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="NO_SHOW">NO_SHOW</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          {editingId ? (
            <Button variant="danger" onClick={cancelAppt}>Cancelar</Button>
          ) : null}
          <Button variant="secondary" onClick={() => setOpenAppt(false)}>Fechar</Button>
          <Button onClick={saveAppt}>{editingId ? "Salvar" : "Criar"}</Button>
        </div>
      </Modal>

      <Modal
        open={openBlock}
        title="Bloquear horário"
        onClose={() => setOpenBlock(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="form-label">Profissional</div>
            <select
              className="form-select mt-2"
              value={blockProfessionalId}
              onChange={(e) => setBlockProfessionalId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="form-label">Início</div>
            <input
              type="time"
              className="form-select mt-2"
              value={blockStart}
              onChange={(e) => setBlockStart(e.target.value)}
            />
          </div>

          <div>
            <div className="form-label">Fim</div>
            <input
              type="time"
              className="form-select mt-2"
              value={blockEnd}
              onChange={(e) => setBlockEnd(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <div className="form-label">Motivo</div>
            <input
              className="form-select mt-2"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Ex: almoço, folga, reunião"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setOpenBlock(false)}>Fechar</Button>
          <Button variant="danger" onClick={createBlock}>Bloquear</Button>
        </div>
      </Modal>
    </div>
  );
}