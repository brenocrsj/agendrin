import Card from "../ui/Card";
import Table from "../ui/Table";

export default function FinanceiroPage() {
  const cards = [
    { title: "Receita Hoje", value: "R$ 320", subtitle: "3 pagamentos" },
    { title: "Receita Semana", value: "R$ 1.980", subtitle: "↑ 9%" },
    { title: "Receita Mês", value: "R$ 7.320", subtitle: "↑ 18%" },
    { title: "Ticket Médio", value: "R$ 62", subtitle: "estável" }
  ];

  const columns = [
    { key: "data", label: "Data" },
    { key: "cliente", label: "Cliente" },
    { key: "valor", label: "Valor" },
    { key: "metodo", label: "Método" }
  ];

  const rows = [
    { data: "04/03", cliente: "Maria", valor: "R$ 40", metodo: "Pix" },
    { data: "04/03", cliente: "Ana", valor: "R$ 60", metodo: "Cartão" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Financeiro</div>
        <div className="mt-1 text-sm text-slate-400">Receitas e movimentações.</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title} title={c.title} value={c.value} subtitle={c.subtitle} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="text-base font-semibold">Últimos pagamentos</div>
        <div className="mt-4">
          <Table columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  );
}