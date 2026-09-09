import React from "react";

export default function EventChip({ event, day, scenario, onDragStart }) {
  return (
    <li
      className="event-chip"
      draggable
      onDragStart={(e) => onDragStart(e, event, day, scenario)}
      title="Drag to another day"
    >
      {event.title}
    </li>
  );
}
