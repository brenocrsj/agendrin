import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-white" />;
  if (!user) return <Navigate to="/entrar" replace />;
  return children;
}