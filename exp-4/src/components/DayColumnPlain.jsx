import React, { useEffect, useRef, useState } from "react";
import EventChip from "./EventChip.jsx";

export default function DayColumnPlain({
  day,
  events,
  scenario,
  tick,
  onDragStart,
  onDrop,
  onRenderCountChange,
}) {
  const [isOver, setIsOver] = useState(false);
  const renderCountRef = useRef(0);
  const [displayCount, setDisplayCount] = useState(0);
  const firstRun = useRef(true);

  // Re-runs on ANY drop anywhere in this scenario (tick changes every time),
  // regardless of whether THIS day's events actually changed. That is the point:
  // without React.memo, every column function body re-executes on every state update.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    renderCountRef.current += 1;
    setDisplayCount(renderCountRef.current);
    onRenderCountChange(day, renderCountRef.current);
  }, [tick]);

  return (
    <div
      className={`day-card no-opt${isOver ? " drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        setIsOver(false);
        onDrop(e, day);
      }}
    >
      <div className="day-head">
        <span className="day-name">{day}</span>
        <span className="render-badge">Renders: {displayCount}</span>
      </div>
      <ul className="event-list">
        {events.length === 0 && <li className="empty">Drop events here</li>}
        {events.map((ev) => (
          <EventChip
            key={ev.id}
            event={ev}
            day={day}
            scenario={scenario}
            onDragStart={onDragStart}
          />
        ))}
      </ul>
    </div>
  );
}
