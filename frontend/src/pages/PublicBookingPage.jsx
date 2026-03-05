import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../ui/Button";
import { api } from "../services/api";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function PublicBookingPage() {
  const { slug } = useParams();

  const [tenant, setTenant] = useState(null);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [professionalId, setProfessionalId] = useState("");

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const accent = tenant?.secondary_color || "#d97735";

  useEffect(() => {
    loadCatalog();
  }, [slug]);

  async function loadCatalog() {
    try {
      const { data } = await api.get(`/api/scheduling/public/${slug}/catalog/`);
      setTenant(data.tenant);
      setServices(data.services);
      setProfessionals(data.professionals);
    } catch {
      setMessage("Não foi possível carregar este site.");
    }
  }

  async function loadSlots() {
    if (!serviceId || !professionalId || !date) return;

    setLoadingSlots(true);
    setSelectedSlot(null);

    try {
      const { data } = await api.get(
        `/api/scheduling/public/${slug}/availability/`,
        {
          params: {
            serviceId,
            professionalId,
            date,
          },
        }
      );

      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, [serviceId, professionalId, date]);

  async function confirm() {
    if (!selectedSlot || !customerName || !customerPhone) {
      setMessage("Preencha seus dados e selecione um horário.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      await api.post(`/api/scheduling/public/${slug}/appointments/`, {
        service_id: Number(serviceId),
        professional_id: Number(professionalId),
        starts_at: selectedSlot,
        customer_name: customerName,
        customer_phone: customerPhone,
      });

      setMessage("Agendamento confirmado! 🎉");

      setCustomerName("");
      setCustomerPhone("");
      setSelectedSlot(null);
    } catch {
      setMessage("Este horário acabou de ser reservado. Escolha outro.");
    } finally {
      setBusy(false);
    }
  }

  const todayLabel = useMemo(() => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [date]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: tenant?.primary_color || "#ffffff",
      }}
    >
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* HEADER */}
        <div className="text-center">
          <div className="text-3xl font-extrabold text-slate-900">
            {tenant?.name || "Agendamento"}
          </div>

          {tenant?.phone && (
            <div className="mt-1 text-sm text-slate-600">
              Contato: {tenant.phone}
            </div>
          )}
        </div>

        {/* SERVIÇO */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-slate-700">
            Serviço
          </div>

          <select
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Selecione...</option>

            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* PROFISSIONAL */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-700">
            Profissional
          </div>

          <select
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
          >
            <option value="">Selecione...</option>

            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* DATA */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-700">Data</div>

          <input
            type="date"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="mt-2 text-xs text-slate-500">{todayLabel}</div>
        </div>

        {/* HORÁRIOS */}
        <div className="mt-6">
          <div className="text-sm font-semibold text-slate-700">
            Horários disponíveis
          </div>

          {loadingSlots ? (
            <div className="mt-3 text-sm text-slate-500">
              Carregando horários...
            </div>
          ) : slots.length === 0 ? (
            <div className="mt-3 text-sm text-slate-500">
              Nenhum horário disponível.
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const active = slot === selectedSlot;

                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      active
                        ? "text-white"
                        : "bg-white text-slate-800 hover:bg-slate-50"
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor: accent,
                            borderColor: accent,
                          }
                        : {}
                    }
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CLIENTE */}
        <div className="mt-8 space-y-4">
          <input
            placeholder="Seu nome"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            placeholder="Seu telefone"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        {/* BOTÃO */}
        <div className="mt-6">
          <Button
            className="w-full py-3 rounded-xl"
            onClick={confirm}
            disabled={busy}
            style={{ backgroundColor: accent }}
          >
            {busy ? "Confirmando..." : "Confirmar agendamento"}
          </Button>
        </div>

        {message && (
          <div className="mt-4 text-center text-sm text-slate-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}