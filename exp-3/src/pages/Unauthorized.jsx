import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="page">
      <h2>🚫 Access denied</h2>
      <p>Your account role doesn't have permission to view that page.</p>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
}
