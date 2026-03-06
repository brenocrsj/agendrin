import { Link } from "react-router-dom";
import Button from "../ui/Button";
import {
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">agendrin</div>
            <div className="text-xs text-slate-500">Agendamento com presença premium</div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/entrar">
              <Button variant="secondary">Entrar</Button>
            </Link>
            <Button>Teste grátis</Button>
          </div>
        </div>
      </header>

      <section className="container-page py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="badge-copper">
              <Sparkles size={14} />
              Sistema de agendamento online
            </div>

            <h1 className="mt-6 max-w-[12ch] text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Seu negócio com agenda elegante e mais organizada.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Centralize clientes, profissionais e horários em uma experiência clara,
              moderna e profissional, pronta para desktop e mobile.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/entrar">
                <Button className="px-5 py-3">
                  Entrar no painel
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/app/inicio">
                <Button variant="secondary" className="px-5 py-3">Ver demonstração</Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-copper-600" />
                Layout responsivo
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-copper-600" />
                Visual premium
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-copper-600" />
                Fluxos preservados
              </span>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Feature icon={CalendarDays} title="Agenda completa" desc="Dia, semana e mês com leitura mais clara." />
              <Feature icon={ShieldCheck} title="Gestão centralizada" desc="Clientes, serviços e profissionais em um só lugar." />
              <Feature icon={Smartphone} title="Experiência mobile" desc="Painel fluido em telas menores e touch." />
              <Feature icon={Sparkles} title="Estética SaaS" desc="Mais confiança para sua marca e operação." />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-copper-100 blur-3xl lg:block" />
            <div className="section-card overflow-hidden p-4 sm:p-5">
              <div className="rounded-[28px] border border-copper-100 bg-gradient-to-br from-white via-white to-copper-50 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Preview do painel</div>
                    <div className="mt-1 text-xs text-slate-500">Uma prévia da nova linguagem visual</div>
                  </div>
                  <div className="badge-copper">Ao vivo</div>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                      <div className="h-3 w-20 rounded-full bg-copper-200" />
                      <div className="mt-4 space-y-3">
                        <div className="h-12 rounded-2xl bg-white shadow-sm" />
                        <div className="h-12 rounded-2xl bg-white shadow-sm" />
                        <div className="h-12 rounded-2xl bg-copper-50 shadow-sm" />
                      </div>
                    </div>
                    <div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="h-3 w-16 rounded-full bg-slate-200" />
                          <div className="mt-3 h-8 w-20 rounded-full bg-copper-200" />
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="h-3 w-16 rounded-full bg-slate-200" />
                          <div className="mt-3 h-8 w-14 rounded-full bg-slate-300" />
                        </div>
                      </div>
                      <div className="mt-4 rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                        <div className="h-3 w-24 rounded-full bg-slate-200" />
                        <div className="mt-4 space-y-3">
                          <div className="h-14 rounded-2xl bg-white shadow-sm" />
                          <div className="h-14 rounded-2xl bg-white shadow-sm" />
                          <div className="h-14 rounded-2xl bg-white shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/70 bg-white/70 backdrop-blur">
        <div className="container-page py-8 text-sm text-slate-500">agendrin • © {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-center gap-3 text-slate-900">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-copper-50 text-copper-700">
          <Icon size={18} />
        </span>
        <span className="font-semibold">{title}</span>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</div>
    </div>
  );
}