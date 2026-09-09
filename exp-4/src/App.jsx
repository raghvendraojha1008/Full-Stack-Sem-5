import React, { useCallback, useState } from "react";
import NonOptimizedCalendar from "./components/NonOptimizedCalendar.jsx";
import OptimizedCalendar from "./components/OptimizedCalendar.jsx";

export default function App() {
  const [resetKey, setResetKey] = useState(0);
  const [totals, setTotals] = useState({ "no-opt": 0, opt: 0 });

  const handleTotalChange = useCallback((scenario, total) => {
    setTotals((prev) => (prev[scenario] === total ? prev : { ...prev, [scenario]: total }));
  }, []);

  const handleReset = () => {
    setResetKey((k) => k + 1); // remounts all day columns -> render counters back to 0
    setTotals({ "no-opt": 0, opt: 0 });
  };

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Weekly Calendar — Drag &amp; Drop Render Optimization Demo</h1>
          <p>
            Events are pre-created and already placed on days. Drag any event chip onto
            another day to move it. In the non-optimized calendar, every day re-renders on
            every move; in the optimized calendar (React.memo + useCallback), only the two
            affected days re-render. Counters start at 0 and only rise with activity.
          </p>
        </div>
        <button className="reset-btn" onClick={handleReset}>
          Reset Counts
        </button>
      </header>

      <section className="scenario">
        <div className="scenario-head">
          <div>
            <h2>
              <span className="tag no-opt">No Optimization</span>
            </h2>
            <p className="sub">No React.memo — every day column re-renders on any move.</p>
          </div>
          <div className="total-card no-opt">
            <div className="label">Total Card Re-renders</div>
            <div className="value">{totals["no-opt"]}</div>
          </div>
        </div>
        <NonOptimizedCalendar resetKey={resetKey} onTotalChange={handleTotalChange} />
      </section>

      <section className="scenario">
        <div className="scenario-head">
          <div>
            <h2>
              <span className="tag opt">Optimized</span>
            </h2>
            <p className="sub">
              React.memo + useCallback — only the source and target day re-render.
            </p>
          </div>
          <div className="total-card opt">
            <div className="label">Total Card Re-renders</div>
            <div className="value">{totals.opt}</div>
          </div>
        </div>
        <OptimizedCalendar resetKey={resetKey} onTotalChange={handleTotalChange} />
      </section>

      <footer className="note">
        Tip: drag an event between two days a few times in each calendar, then compare the{" "}
        <code>Renders</code> badges on the other five, untouched days — they climb in the
        non-optimized calendar and stay flat in the optimized one.
      </footer>
    </div>
  );
}
