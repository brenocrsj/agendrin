import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ClientesPage from "./pages/ClientesPage";
import ServicosPage from "./pages/ServicosPage";
import AgendaPage from "./pages/AgendaPage";
import AppShell from "./layout/AppShell";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/entrar" element={<LoginPage />} />

      <Route
        path="/app/inicio"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/clientes"
        element={
          <ProtectedRoute>
            <AppShell>
              <ClientesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/servicos"
        element={
          <ProtectedRoute>
            <AppShell>
              <ServicosPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/agenda"
        element={
          <ProtectedRoute>
            <AppShell>
              <AgendaPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}