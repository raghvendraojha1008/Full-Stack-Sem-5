import React, { useCallback, useRef, useState } from "react";
import { DAYS, seedEvents } from "../data/events.js";
import DayColumnMemo from "./DayColumnMemo.jsx";

const SCENARIO = "opt";

export default function OptimizedCalendar({ resetKey, onTotalChange }) {
  const [events, setEvents] = useState(seedEvents);
  const countsRef = useRef({});

  // Stable references (empty dep arrays) so DayColumnMemo's shallow prop
  // comparison isn't defeated by a freshly created function every render.
  const handleDragStart = useCallback((e, event, day, scenario) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: event.id, fromDay: day, scenario })
    );
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDrop = useCallback((e, targetDay) => {
    e.preventDefault();
    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }
    if (!payload || payload.scenario !== SCENARIO) return;
    const { id, fromDay } = payload;
    if (fromDay === targetDay) return;

    setEvents((prev) => {
      const moved = prev[fromDay].find((ev) => ev.id === id);
      if (!moved) return prev;
      return {
        ...prev,
        [fromDay]: prev[fromDay].filter((ev) => ev.id !== id),
        [targetDay]: [...prev[targetDay], moved],
      };
      // Only fromDay and targetDay get new array references —
      // the other five days keep their old reference, so memo skips them.
    });
  }, []);

  const handleRenderCountChange = useCallback(
    (day, count) => {
      countsRef.current[day] = count;
      const total = Object.values(countsRef.current).reduce((a, b) => a + b, 0);
      onTotalChange(SCENARIO, total);
    },
    [onTotalChange]
  );

  return (
    <div className="week-grid">
      {DAYS.map((day) => (
        <DayColumnMemo
          key={`${resetKey}-${day}`}
          day={day}
          events={events[day]}
          scenario={SCENARIO}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onRenderCountChange={handleRenderCountChange}
        />
      ))}
    </div>
  );
}
