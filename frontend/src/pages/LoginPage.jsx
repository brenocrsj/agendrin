import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { LockKeyhole, Mail, Sparkles } from "lucide-react";

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
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_480px]">
        <div className="hidden lg:block">
          <div className="badge-copper">
            <Sparkles size={14} />
            Área administrativa
          </div>
          <h1 className="mt-6 max-w-[12ch] text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Entre para gerenciar a sua operação.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Uma experiência mais limpa, profissional e confiável para acessar sua agenda,
            seus clientes e seus relatórios.
          </p>
        </div>

        <div className="w-full rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-soft backdrop-blur sm:p-10">
          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900">agendrin</div>
            <div className="mt-2 text-xl font-bold text-slate-900">Bem-vindo de volta</div>
            <div className="mt-1 text-sm text-slate-500">Acesse sua conta para continuar</div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="form-label">Seu e-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control pl-11"
                  placeholder="email@exemplo.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Sua senha</label>
              <div className="relative">
                <LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control pl-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button className="w-full py-3 rounded-[20px]" disabled={busy}>
              {busy ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center">
              <Link to="/" className="text-sm font-medium text-slate-500 transition hover:text-copper-700">
                Voltar para o site
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}