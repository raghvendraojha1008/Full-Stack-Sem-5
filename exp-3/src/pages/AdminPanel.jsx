import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h2>Admin Panel</h2>
      <div className="card">
        <p>
          Welcome, <strong>{user.email}</strong>. Only users with the{" "}
          <span className="badge">admin</span> role can see this page — try
          logging in as a "viewer" account and visiting <code>/admin</code>{" "}
          directly to see the redirect happen.
        </p>
      </div>
    </div>
  );
}
