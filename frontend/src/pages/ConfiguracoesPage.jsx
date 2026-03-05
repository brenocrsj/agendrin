import Button from "../ui/Button";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Configurações</div>
        <div className="mt-1 text-sm text-slate-400">Preferências do sistema.</div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
        <div>
          <div className="text-sm text-slate-400">Tema</div>
          <div className="mt-2 flex gap-2">
            <Button variant="secondary">Dark</Button>
            <Button variant="secondary">Light</Button>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400">Empresa</div>
          <input
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            defaultValue="Minha empresa"
          />
        </div>

        <div className="pt-2">
          <Button variant="primary">Salvar</Button>
        </div>
      </div>
    </div>
  );
}