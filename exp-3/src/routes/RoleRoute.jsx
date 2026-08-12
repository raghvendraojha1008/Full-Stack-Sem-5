import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any page that should only be visible to specific roles.
 * Usage:  <RoleRoute allowedRoles={["admin"]}><AdminPanel /></RoleRoute>
 *
 * Must be used INSIDE a <ProtectedRoute>, since it assumes the user is
 * already logged in.
 */
export default function RoleRoute({ allowedRoles, children }) {
  const { role, loading } = useAuth();

  if (loading) {
    return <p className="status">Checking permissions…</p>;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
