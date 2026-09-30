import { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import Dashboard from "./Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null); // { name, role } | null

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 380, margin: "60px auto", padding: 24, border: "1px solid #ddd", borderRadius: 12 }}>
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <LoginForm onLogin={(name, role) => setUser({ name, role })} />
      )}
    </div>
  );
}
