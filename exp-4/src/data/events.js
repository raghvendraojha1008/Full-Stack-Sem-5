export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Pre-created events, already assigned to specific days.
// Users move these between days via drag-and-drop — nothing is created at runtime.
export function seedEvents() {
  return {
    Monday: [
      { id: "ev-1", title: "Team Sync" },
      { id: "ev-2", title: "1:1 with Manager" },
    ],
    Tuesday: [{ id: "ev-3", title: "Design Review" }],
    Wednesday: [
      { id: "ev-4", title: "Sprint Planning" },
      { id: "ev-5", title: "Client Call" },
    ],
    Thursday: [{ id: "ev-6", title: "Code Review" }],
    Friday: [
      { id: "ev-7", title: "Retro" },
      { id: "ev-8", title: "Demo Day" },
    ],
    Saturday: [{ id: "ev-9", title: "Community Meetup" }],
    Sunday: [],
  };
}
