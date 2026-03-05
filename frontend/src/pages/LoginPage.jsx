import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function LoginPage() {
  const nav = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    // mock login
    nav("/app/inicio");
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center px-4">
      <div className="w-full max-w-[520px] rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            agendin
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
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-300"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Sua senha</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-300"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" defaultChecked />
              Mantenha conectado
            </label>

            <button type="button" className="text-sm font-semibold text-slate-700 hover:underline">
              Esqueci a senha
            </button>
          </div>

          <Button className="w-full py-3 rounded-2xl">Entrar</Button>

          <div className="text-center text-sm text-slate-500">
            Ainda não possui conta?{" "}
            <span className="font-semibold text-slate-700 hover:underline cursor-pointer">
              Teste grátis por 15 dias
            </span>
          </div>

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