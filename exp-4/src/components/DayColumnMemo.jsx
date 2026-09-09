import React, { useEffect, useRef, useState, memo } from "react";
import EventChip from "./EventChip.jsx";

function DayColumnMemoInner({
  day,
  events,
  scenario,
  onDragStart,
  onDrop,
  onRenderCountChange,
}) {
  const [isOver, setIsOver] = useState(false);
  const renderCountRef = useRef(0);
  const [displayCount, setDisplayCount] = useState(0);
  const firstRun = useRef(true);

  // Only fires when THIS day's own `events` array reference changes (i.e. an event
  // was dropped onto or dragged out of this specific day). React.memo below prevents
  // this component from even re-rendering when unrelated days change.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    renderCountRef.current += 1;
    setDisplayCount(renderCountRef.current);
    onRenderCountChange(day, renderCountRef.current);
  }, [events]);

  return (
    <div
      className={`day-card opt${isOver ? " drag-over" : ""}`}
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

// Default shallow prop comparison is enough: `events` keeps a stable array reference
// for every day except the two involved in a drag-and-drop move.
const DayColumnMemo = memo(DayColumnMemoInner);
export default DayColumnMemo;
