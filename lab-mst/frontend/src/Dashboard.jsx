import { useState } from "react";

export default function Dashboard({ user, onLogout }) {
  const [msg, setMsg] = useState("");

  return (
    <div>
      <h2>Welcome, {user.name} ({user.role})</h2>

      {user.role === "Admin" ? (
        <button onClick={() => setMsg("Post deleted (demo).")}>Delete Post</button>
      ) : (
        <p>Read-only access</p>
      )}

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <button onClick={onLogout} style={{ marginTop: 14 }}>Logout</button>
    </div>
  );
}
