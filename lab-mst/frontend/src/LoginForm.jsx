import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const name = username.trim();

  return (
    <div>
      <h2>Login</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        style={{ width: "100%", padding: 10, boxSizing: "border-box" }}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button disabled={!name} onClick={() => onLogin(name, "Admin")}>Login as Admin</button>
        <button disabled={!name} onClick={() => onLogin(name, "Viewer")}>Login as Viewer</button>
      </div>
    </div>
  );
}
