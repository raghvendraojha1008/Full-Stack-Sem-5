import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../firebase/authService";
import { hasPermission } from "../firebase/permissions";

export default function Dashboard() {
  const { user, role, tokenClaims } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <div className="card">
        <p>
          Logged in as <strong>{user.email}</strong>
        </p>
        <p>
          Your role: <span className="badge">{role}</span>
        </p>
      </div>

      {/* Conditional Rendering Based on Roles (Theory section 8) */}
      <div className="card">
        <h3>Actions available to you</h3>
        <div className="action-row">
          {hasPermission(role, "view") && <button>View content</button>}
          {hasPermission(role, "create") && <button>Create post</button>}
          {hasPermission(role, "edit") && <button>Edit post</button>}
          {hasPermission(role, "delete") && (
            <button className="danger">Delete post</button>
          )}
        </div>
        {role === "admin" && (
          <p className="hint">
            You're an admin — you also have access to the{" "}
            <a href="/admin">Admin Panel</a>.
          </p>
        )}
      </div>

      {/* JWT structure demo (Theory section 2) */}
      <div className="card">
        <h3>Decoded JWT payload (for learning purposes)</h3>
        <p className="hint">
          This is the middle part of your real Firebase ID token, decoded in
          the browser. This is what "HEADER.PAYLOAD.SIGNATURE" looks like in
          practice.
        </p>
        <pre className="token-box">{JSON.stringify(tokenClaims, null, 2)}</pre>
      </div>
    </div>
  );
}
