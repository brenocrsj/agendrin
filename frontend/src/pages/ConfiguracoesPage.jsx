import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import { api } from "../services/api";

export default function ConfiguracoesPage() {
  const [tenant, setTenant] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/api/core/tenant/me/").then(({ data }) => setTenant(data));
  }, []);

  const bookingLink = useMemo(() => {
    const origin = window.location.origin;
    const slug = tenant?.slug || "meu-cliente";
    return `${origin}/u/${slug}`;
  }, [tenant]);

  async function save() {
    setMsg("");
    setBusy(true);
    try {
      const { data } = await api.patch("/api/core/tenant/me/", tenant);
      setTenant(data);
      setMsg("Salvo com sucesso ✅");
    } catch {
      setMsg("Erro ao salvar. Verifique se o slug é único.");
    } finally {
      setBusy(false);
    }
  }

  if (!tenant) return <div className="text-sm text-slate-500">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900">Configurações</div>
        <div className="mt-2 text-slate-600">Configure o site público de agendamento do seu cliente.</div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Nome">
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
              value={tenant.name}
              onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
            />
          </Field>

          <Field label="Slug (link público)">
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
              value={tenant.slug}
              onChange={(e) => setTenant({ ...tenant, slug: e.target.value })}
            />
          </Field>

          <Field label="Telefone">
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white"
              value={tenant.phone || ""}
              onChange={(e) => setTenant({ ...tenant, phone: e.target.value })}
            />
          </Field>

          <Field label="Cor primária (fundo)">
            <input
              type="color"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-2"
              value={tenant.primary_color || "#ffffff"}
              onChange={(e) => setTenant({ ...tenant, primary_color: e.target.value })}
            />
          </Field>

          <Field label="Cor secundária (detalhes)">
            <input
              type="color"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-2"
              value={tenant.secondary_color || "#d97735"}
              onChange={(e) => setTenant({ ...tenant, secondary_color: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold text-slate-600">Link público</div>
          <div className="mt-2 flex gap-2">
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              readOnly
              value={bookingLink}
            />
            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(bookingLink)}>
              Copiar
            </Button>
            <Button variant="secondary" onClick={() => window.open(bookingLink, "_blank")}>
              Abrir
            </Button>
          </div>
        </div>

        {msg ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {msg}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => window.location.reload()}>Recarregar</Button>
          <Button onClick={save} disabled={busy}>{busy ? "Salvando..." : "Salvar"}</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      {children}
    </div>
  );
}