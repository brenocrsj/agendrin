import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import Button from "../ui/Button";

export default function PublicBookingPage() {
  const { slug } = useParams();

  const [tenant, setTenant] = useState(null);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [selectedSlot, setSelectedSlot] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await api.get(`/api/scheduling/public/${slug}/catalog/`);
      setTenant(data.tenant);
      setServices(data.services);
      setProfessionals(data.professionals);
    }
    load().catch(() => setError("Link inválido ou indisponível."));
  }, [slug]);

  const canLoadSlots = useMemo(() => serviceId && professionalId && date, [serviceId, professionalId, date]);

  async function loadSlots() {
    setError("");
    setSlots([]);
    setSelectedSlot("");
    if (!canLoadSlots) return;

    const { data } = await api.get(
      `/api/scheduling/public/${slug}/availability/`,
      { params: { serviceId, professionalId, date } }
    );
    setSlots(data.slots || []);
  }

  useEffect(() => {
    loadSlots().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, professionalId, date]);

  async function confirm() {
    setError("");
    if (!selectedSlot) return setError("Selecione um horário.");
    if (!customerName.trim() || !customerPhone.trim()) return setError("Preencha nome e telefone.");

    setBusy(true);
    try {
      await api.post(`/api/scheduling/public/${slug}/appointments/`, {
        service_id: Number(serviceId),
        professional_id: Number(professionalId),
        starts_at: selectedSlot,
        customer_name: customerName,
        customer_phone: customerPhone,
      });
      setDone(true);
    } catch (e) {
      setError("Não foi possível confirmar. Tente outro horário.");
    } finally {
      setBusy(false);
    }
  }

  if (error && !tenant) {
    return <div className="min-h-screen bg-white flex items-center justify-center p-6">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div className="font-extrabold tracking-tight text-slate-900">
            {tenant?.name || "Agendamento"}
          </div>
          <div className="text-sm text-slate-500">Agende online</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          {done ? (
            <div>
              <div className="text-2xl font-extrabold text-slate-900">Agendamento confirmado ✅</div>
              <div className="mt-2 text-slate-600">
                Você receberá a confirmação/lembrete conforme configuração do estabelecimento.
              </div>
              <div className="mt-6">
                <Button onClick={() => window.location.reload()}>Agendar outro</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-extrabold text-slate-900">Escolha seu horário</div>
              <div className="mt-1 text-slate-600">Simples, rápido e responsivo.</div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Serviço</label>
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
                  <label className="text-xs font-semibold text-slate-600">Profissional</label>
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
                  <label className="text-xs font-semibold text-slate-600">Data</label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold text-slate-600">Horários disponíveis</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {slots.length === 0 ? (
                    <div className="text-sm text-slate-500">Nenhum horário disponível.</div>
                  ) : (
                    slots.map((iso) => {
                      const dt = new Date(iso);
                      const label = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const active = selectedSlot === iso;
                      return (
                        <button
                          key={iso}
                          onClick={() => setSelectedSlot(iso)}
                          className={[
                            "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                            active
                              ? "border-copper-400 bg-copper-50 text-copper-800"
                              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Seu nome</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Maria"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Telefone (WhatsApp)</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex: 11999999999"
                  />
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="mt-6">
                <Button className="w-full py-3 rounded-2xl" onClick={confirm} disabled={busy}>
                  {busy ? "Confirmando..." : "Confirmar agendamento"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}