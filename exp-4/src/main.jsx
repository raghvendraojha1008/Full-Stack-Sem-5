import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Note: StrictMode is intentionally not used here. In development it double-invokes
// effects/renders, which would make the on-screen render counters misleading for
// this demo. The optimization behavior (memo skipping renders) is unaffected either way.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
