import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

import AppShell from "./layout/AppShell";
import DashboardPage from "./pages/DashboardPage";
import AgendaPage from "./pages/AgendaPage";
import ClientesPage from "./pages/ClientesPage";
import ServicosPage from "./pages/ServicosPage";
import ProfissionaisPage from "./pages/ProfissionaisPage";
import FinanceiroPage from "./pages/FinanceiroPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";

export default function App() {
  return (
    <Routes>
      {/* público */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/entrar" element={<LoginPage />} />

      {/* painel */}
      <Route
        path="/app/*"
        element={
          <AppShell>
            <Routes>
              <Route path="" element={<Navigate to="inicio" replace />} />
              <Route path="inicio" element={<DashboardPage />} />
              <Route path="agenda" element={<AgendaPage />} />
              <Route path="clientes" element={<ClientesPage />} />
              <Route path="servicos" element={<ServicosPage />} />
              <Route path="profissionais" element={<ProfissionaisPage />} />
              <Route path="financeiro" element={<FinanceiroPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
              <Route path="*" element={<Navigate to="/app/inicio" replace />} />
            </Routes>
          </AppShell>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}