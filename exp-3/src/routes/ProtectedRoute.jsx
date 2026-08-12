import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any page that should ONLY be visible to logged-in users.
 * Usage:  <ProtectedRoute><Dashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="status">Checking your session…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
