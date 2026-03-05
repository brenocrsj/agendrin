import Card from "../ui/Card";
import Button from "../ui/Button";

export default function DashboardPage() {
  const cards = [
    { title: "Agendamentos", value: "17", hint: "últimos 7 dias" },
    { title: "Concluídos", value: "14", hint: "últimos 7 dias" },
    { title: "Cancelados", value: "2", hint: "últimos 7 dias" },
    { title: "Ausentes", value: "0", hint: "últimos 7 dias" },
    { title: "Taxa de Cancelamento", value: "11.8%", hint: "últimos 7 dias" },
    { title: "Total Concluídos", value: "R$ 710,00", hint: "últimos 7 dias" },
    { title: "Pagamentos Recebidos", value: "R$ 0,00", hint: "últimos 7 dias" },
    { title: "Ticket Médio", value: "R$ 50,71", hint: "últimos 7 dias" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-3xl font-extrabold tracking-tight text-slate-900">
          Seja bem-vindo
        </div>
        <div className="mt-1 text-slate-600">
          Você é integrante da empresa <span className="font-semibold">Acordes Barbearia</span>.
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-lg font-bold text-slate-900">⚡ Acesso Rápido</div>
            <div className="text-sm text-slate-500">Atalhos para ações comuns</div>
          </div>

          <div className="flex gap-2">
            <Button>Novo Agendamento</Button>
            <Button variant="secondary">Agenda</Button>
            <Button variant="secondary">Todos Agendamentos</Button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-lg font-bold text-slate-900">🔗 Link de Agendamento</div>
            <div className="text-sm text-slate-500">
              Seus clientes acessam este link para agendar serviços.
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary">Copiar</Button>
            <Button variant="secondary">Abrir</Button>
            <Button variant="secondary">QR Code</Button>
            <Button>Configurar</Button>
          </div>
        </div>

        <div className="mt-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-300"
            defaultValue="https://agendin.com.br/acordesbarbearia"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="text-lg font-bold text-slate-900">📊 Estatísticas (últimos 7 dias)</div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.title} title={c.title} value={c.value} hint={c.hint} />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="secondary">Ver Mais »</Button>
        </div>
      </div>
    </div>
  );
}