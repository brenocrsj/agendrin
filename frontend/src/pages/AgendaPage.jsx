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
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">Agenda</div>
          <div className="mt-1 text-sm text-slate-500">{todayLabel}</div>
          <div className="mt-2">
            <input
              type="date"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white"
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
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        {loading ? (
          <div className="text-sm text-slate-500">Carregando...</div>
        ) : (
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-[80px_1fr] bg-slate-50 border-b border-slate-200">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500">Hora</div>
              <div className="px-3 py-2 text-xs font-semibold text-slate-500">Agendamentos / Bloqueios</div>
            </div>

            <div className="grid grid-cols-[80px_1fr]">
              {hours.map((h) => {
                const hh = String(h).padStart(2, "0");
                const hourPrefix = `${hh}:`;
                const apptsHere = appointments.filter((a) => hhmm(a.starts_at).startsWith(hourPrefix));
                const blocksHere = blocks.filter((b) => hhmm(b.starts_at).startsWith(hourPrefix));

                return (
                  <div key={h} className="contents">
                    <div className="border-b border-slate-100 px-3 py-3 text-xs text-slate-500">
                      {hh}:00
                    </div>
                    <div className="border-b border-slate-100 px-3 py-2 space-y-2">
                      {blocksHere.map((b) => (
                        <div key={b.id} className="rounded-2xl bg-slate-900 text-white px-4 py-3">
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
                          className="w-full text-left rounded-2xl bg-emerald-600 text-white px-4 py-3 hover:opacity-95"
                        >
                          <div className="text-sm font-semibold">
                            {a.customer_name || "Agendamento"} {/* se vier nested depois você melhora */}
                          </div>
                          <div className="mt-1 text-xs opacity-90">
                            {hhmm(a.starts_at)} - {hhmm(a.ends_at)} • status: {a.status}
                          </div>
                          <div className="mt-1 text-xs opacity-90">
                            (clique para editar)
                          </div>
                        </button>
                      ))}

                      {apptsHere.length === 0 && blocksHere.length === 0 ? (
                        <div className="text-xs text-slate-400">Livre</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Agendamento */}
      <Modal
        open={openAppt}
        title={editingId ? "Editar agendamento" : "Novo agendamento"}
        onClose={() => setOpenAppt(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold text-slate-600">Serviço</div>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
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
            <div className="text-xs font-semibold text-slate-600">Profissional</div>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
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
            <div className="text-xs font-semibold text-slate-600">Cliente</div>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
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
            <div className="text-xs font-semibold text-slate-600">Horário</div>
            <input
              type="time"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Status</div>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
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

      {/* Modal Bloqueio */}
      <Modal
        open={openBlock}
        title="Bloquear horário"
        onClose={() => setOpenBlock(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Profissional</div>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
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
            <div className="text-xs font-semibold text-slate-600">Início</div>
            <input
              type="time"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
              value={blockStart}
              onChange={(e) => setBlockStart(e.target.value)}
            />
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600">Fim</div>
            <input
              type="time"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
              value={blockEnd}
              onChange={(e) => setBlockEnd(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Motivo</div>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
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