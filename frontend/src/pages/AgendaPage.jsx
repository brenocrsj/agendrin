import { useMemo, useState } from "react";
import Button from "../ui/Button";

const mockEvents = [
  { id: 1, title: "Corte e Barba - Cleiton Santos", start: "09:00", end: "10:40", color: "bg-emerald-600" },
  { id: 2, title: "Barba + sobrancelha - Hugo Monteiro", start: "15:00", end: "16:00", color: "bg-sky-600" }
];

export default function AgendaPage() {
  const [mode, setMode] = useState("dia"); // dia | semana | mes

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">Agenda</div>
          <div className="mt-1 text-sm text-slate-500">{todayLabel}</div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="rounded-2xl border border-slate-200 bg-white p-1">
            <ModeBtn active={mode==="dia"} onClick={() => setMode("dia")}>Dia</ModeBtn>
            <ModeBtn active={mode==="semana"} onClick={() => setMode("semana")}>Semana</ModeBtn>
            <ModeBtn active={mode==="mes"} onClick={() => setMode("mes")}>Mês</ModeBtn>
          </div>
          <Button>Novo Agendamento</Button>
          <Button variant="danger">Bloquear Horário</Button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm font-semibold text-slate-700">
            BRENO CARLOS RODRIGUES SILVA
          </div>

          <div className="flex gap-2">
            <Button variant="secondary">Mostrar profissionais</Button>
            <Button variant="secondary">↻</Button>
          </div>
        </div>

        <div className="mt-4">
          {mode === "dia" ? <DayView events={mockEvents} /> : null}
          {mode === "semana" ? <WeekView /> : null}
          {mode === "mes" ? <MonthView /> : null}
        </div>
      </div>
    </div>
  );
}

function ModeBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-semibold rounded-xl transition ${
        active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function DayView({ events }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08..19
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-[80px_1fr] bg-slate-50 border-b border-slate-200">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500">Hora</div>
        <div className="px-3 py-2 text-xs font-semibold text-slate-500">Agendamentos</div>
      </div>

      <div className="grid grid-cols-[80px_1fr]">
        {hours.map((h) => (
          <div key={h} className="contents">
            <div className="border-b border-slate-100 px-3 py-3 text-xs text-slate-500">
              {String(h).padStart(2, "0")}:00
            </div>
            <div className="border-b border-slate-100 px-3 py-2">
              {/* eventos mock */}
              {h === 9 ? (
                <EventCard e={events[0]} />
              ) : null}
              {h === 15 ? (
                <EventCard e={events[1]} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventCard({ e }) {
  return (
    <div className={`rounded-2xl ${e.color} text-white px-4 py-3`}>
      <div className="text-sm font-semibold">{e.title}</div>
      <div className="mt-1 text-xs opacity-90">
        {e.start} - {e.end}
      </div>
    </div>
  );
}

function WeekView() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
      Visão de semana (UI pronta). Posso deixar igual ao exemplo com colunas por dia e drag & drop.
    </div>
  );
}

function MonthView() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
      Visão de mês (UI pronta). Posso montar grid mensal e badges por agendamento.
    </div>
  );
}