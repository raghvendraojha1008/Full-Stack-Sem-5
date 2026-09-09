import React, { useCallback, useRef, useState } from "react";
import { DAYS, seedEvents } from "../data/events.js";
import DayColumnPlain from "./DayColumnPlain.jsx";

const SCENARIO = "no-opt";

export default function NonOptimizedCalendar({ resetKey, onTotalChange }) {
  const [events, setEvents] = useState(seedEvents);
  const [tick, setTick] = useState(0);
  const countsRef = useRef({});

  const handleDragStart = (e, event, day, scenario) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: event.id, fromDay: day, scenario })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, targetDay) => {
    e.preventDefault();
    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }
    if (!payload || payload.scenario !== SCENARIO) return; // ignore cross-calendar drops
    const { id, fromDay } = payload;
    if (fromDay === targetDay) return; // dropped back on the same day, nothing changes

    setEvents((prev) => {
      const moved = prev[fromDay].find((ev) => ev.id === id);
      if (!moved) return prev;
      return {
        ...prev,
        [fromDay]: prev[fromDay].filter((ev) => ev.id !== id),
        [targetDay]: [...prev[targetDay], moved],
      };
    });
    setTick((t) => t + 1); // every move re-renders ALL non-optimized columns
  };

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
        <DayColumnPlain
          key={`${resetKey}-${day}`}
          day={day}
          events={events[day]}
          scenario={SCENARIO}
          tick={tick}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onRenderCountChange={handleRenderCountChange}
        />
      ))}
    </div>
  );
}
