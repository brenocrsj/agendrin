import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace />;
  }

  return children;
}