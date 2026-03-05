import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { CalendarDays, ShieldCheck, Sparkles, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex items-center justify-between py-4">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">
            agendrin
          </div>

          <div className="flex items-center gap-2">
            <Link to="/entrar">
              <Button variant="secondary">Entrar</Button>
            </Link>
            <Button>Teste grátis</Button>
          </div>
        </div>
      </header>

      <section className="container-page py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Sparkles size={14} />
              Sistema de agendamento online
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
              Facilite o agendamento de seus serviços
            </h1>

            <p className="mt-4 text-slate-600 leading-relaxed">
              Organize sua agenda, profissionais e clientes. Envie lembretes e
              reduza faltas com uma experiência profissional.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/entrar">
                <Button>Entrar no painel</Button>
              </Link>
              <Link to="/app/inicio">
                <Button variant="secondary">Ver demonstração</Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Feature icon={CalendarDays} title="Agenda completa" desc="Dia, semana e mês com visão clara." />
              <Feature icon={ShieldCheck} title="Gestão" desc="Clientes, serviços e profissionais." />
              <Feature icon={Smartphone} title="Acesso mobile" desc="Layout responsivo e rápido." />
              <Feature icon={Sparkles} title="Profissional" desc="Interface SaaS moderna e limpa." />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-900">Preview do painel</div>
              <div className="mt-3 h-[360px] rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 border border-slate-200" />
              <div className="mt-3 text-xs text-slate-500">
                (mock visual — seu painel real está em /app)
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container-page py-8 text-sm text-slate-500">
          agendrin • © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-900 font-semibold">
        <Icon size={18} className="text-blue-600" />
        {title}
      </div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </div>
  );
}