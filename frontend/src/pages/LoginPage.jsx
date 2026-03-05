import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      nav("/app/inicio");
    } catch (err) {
      setError("E-mail ou senha inválidos.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center px-4">
      <div className="w-full max-w-[520px] rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            agendrin
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            Bem-vindo de volta
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Acesse sua conta para continuar
          </div>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-xs font-semibold text-slate-600">Seu e-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-300"
              placeholder="email@exemplo.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Sua senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-300"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button className="w-full py-3 rounded-2xl" disabled={busy}>
            {busy ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center">
            <Link to="/" className="text-sm text-slate-500 hover:underline">
              Voltar para o site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}