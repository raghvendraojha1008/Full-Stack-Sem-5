# Weekly Calendar — Drag & Drop Render Optimization Demo

A real React + Node (Vite) project — not a single HTML file — demonstrating
**optimized vs non-optimized re-rendering** using a drag-and-drop weekly calendar
(Experiment 4: Interactive Calendar Optimization & Testing).

## Setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## What it does

- **Pre-created events** — events already exist on specific days (`src/data/events.js`).
  Nothing is created at runtime; users only **drag and drop** existing events between
  the 7 days of the week (Monday → Sunday, no time-slot column).
- **Two calendars, stacked:**
  - **No Optimization** (`NonOptimizedCalendar.jsx` + `DayColumnPlain.jsx`) — plain
    components, no `React.memo`. Moving one event re-renders **all 7** day columns.
  - **Optimized** (`OptimizedCalendar.jsx` + `DayColumnMemo.jsx`) — day columns wrapped
    in `React.memo`, with `useCallback`-stabilized handlers. Moving an event only
    re-renders the **source and target** day (the other 5 stay untouched).
- **Per-day render counter** ("Renders: N") — starts at `0`, only increments on real
  re-renders (initial mount doesn't count).
- **Total Card Re-renders** summary at the top of each calendar.
- **Reset Counts** button — remounts all day columns, zeroing every counter without a
  page refresh (event positions are untouched).

## Project structure

```
calendar-dnd-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   └── events.js               # pre-seeded events per day
│   └── components/
│       ├── EventChip.jsx           # draggable event pill
│       ├── DayColumnPlain.jsx      # non-optimized day column
│       ├── DayColumnMemo.jsx       # React.memo-optimized day column
│       ├── NonOptimizedCalendar.jsx
│       └── OptimizedCalendar.jsx
└── README.md
```

## How the drag-and-drop works

Native HTML5 drag-and-drop is used (no extra library):
- `draggable` + `onDragStart` on each event chip stores `{ id, fromDay, scenario }`
  in `event.dataTransfer`.
- `onDragOver` + `onDrop` on each day column reads that payload and moves the event
  from `fromDay` to the drop target's day, immutably updating state.
- A `scenario` tag in the payload keeps the two calendars independent — you can't
  accidentally drag an event from the optimized calendar into the non-optimized one.

## Why the counts differ

- In `NonOptimizedCalendar`, every drop bumps a shared `tick` state value passed to
  every column. Since columns aren't memoized, React re-executes **all** of them
  whenever `tick` changes — regardless of whether their own events changed.
- In `OptimizedCalendar`, each column only receives its own day's `events` array.
  Since the state update only creates new array references for the source and target
  day (the other 5 keep the same reference), `React.memo`'s shallow prop comparison
  skips re-rendering the untouched columns entirely.
