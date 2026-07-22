# Dispatch Desk — Post Composer & Draft Management

**Unit 1 · Experiment 1** — a frontend module for composing social posts with
platform-specific character-limit validation, and for saving, editing, and
deleting drafts (with a simulated backend layer).

---

## 1. What's inside

```
post-composer/
├── index.html
├── package.json
├── vite.config.js
├── README.md                  ← this file
└── src/
    ├── main.jsx                 React entry point
    ├── App.jsx / App.css        App shell — layout, toast, wiring
    ├── index.css                 Design tokens (colors, type, radii)
    ├── constants/
    │   └── platforms.js          Twitter/X, LinkedIn, Instagram configs
    ├── patterns/
    │   ├── validationStrategies.js   Strategy pattern: per-platform rules
    │   └── draftFactory.js           Factory pattern: consistent draft shape
    ├── services/
    │   └── draftService.js       Simulated backend (Promises + localStorage)
    ├── hooks/
    │   ├── useDrafts.js           Draft CRUD + loading/error state
    │   ├── useCharacterLimit.js   Derives remaining chars / status
    │   └── useLocalStorage.js     Generic localStorage-synced state
    └── components/
        ├── PostComposer/         Controlled form: title, text, media, platforms
        ├── PlatformSelector/     Toggle chips for each platform
        ├── CharacterMeter/       Signal-gauge character counter (signature UI)
        ├── DraftList/            Renders saved drafts
        ├── DraftItem/            Single draft row (edit / delete)
        └── Toast/                Success / error / info notifications
```

### Concepts demonstrated
- **Controlled components** — every input (title, text, platform chips, media
  count) is driven by React state, nothing reads from the DOM directly.
- **Form validation strategies** — `validationStrategies.js` implements the
  **Strategy pattern**: each platform (Twitter/X, LinkedIn, Instagram) owns
  its own validation function with a shared signature, so the composer never
  branches on `if (platform === ...)`.
- **Factory pattern** — `draftFactory.js` guarantees every draft object
  (new, duplicated, or updated) has the same shape and metadata.
- **Reusable logic via hooks** — `useDrafts`, `useCharacterLimit`, and
  `useLocalStorage` extract state logic out of components so it can be
  reused and unit-tested independently.
- **Simulated backend** — `draftService.js` mimics a REST API: it returns
  Promises, adds artificial latency, and randomly fails ~8% of calls so the
  UI has to handle real loading/error states, even though data is actually
  persisted to `localStorage`.

---

## 2. Requirements

- **Node.js 18+** (Node 20 LTS recommended)
- **npm 9+** (ships with Node)

Check your versions:
```bash
node -v
npm -v
```

---

## 3. Setup & run

1. **Unzip** the project and open a terminal in the `post-composer` folder:
   ```bash
   cd post-composer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Vite will print a local URL — typically:
   ```
   ➜  Local:   http://localhost:5173/
   ```
   Open that URL in your browser. The app hot-reloads as you edit files.

4. **(Optional) Production build:**
   ```bash
   npm run build      # outputs to dist/
   npm run preview    # serves the production build locally
   ```

---

## 4. Using the app

1. **Write a post** in the text area. An internal title is optional — if you
   leave it blank, one is generated from your text.
2. **Select platforms** by clicking the chips (X/Twitter, LinkedIn,
   Instagram). Each has its own character limit and rules:
   - **X/Twitter** — 280 characters, up to 4 media attachments.
   - **LinkedIn** — 3,000 characters; warns if your opening line is too long
     (LinkedIn truncates previews around 150 characters).
   - **Instagram** — 2,200 characters; requires at least one media
     attachment.
3. Watch the **signal meter** — it shows characters used against the
   *tightest* limit among your selected platforms, and turns amber/red as
   you approach or exceed it.
4. Adjust **attached media** (a numeric stand-in for real uploads) to see
   the per-platform media-count validation kick in.
5. Any validation issues appear as a list below the platform chips —
   warnings are informational, errors block saving/publishing.
6. **Save as draft** persists the post (simulated network call, ~0.5s,
   occasionally fails so you can see the error toast/retry pattern).
7. Drafts appear in the **Draft queue** on the right. From there you can
   **Edit** (loads the post back into the composer) or **Delete** it.
8. **Publish now** saves the draft and then runs a simulated "publish" call
   per selected platform.

All draft data lives in your browser's `localStorage` under the key
`post-composer:drafts`, so it persists across page reloads but is local to
that browser.

---

## 5. Extending the experiment

- **Add a platform:** add an entry to `PLATFORMS` in
  `src/constants/platforms.js`, then add a matching function to
  `VALIDATION_STRATEGIES` in `src/patterns/validationStrategies.js`.
- **Swap the simulated backend for a real API:** replace the internals of
  `src/services/draftService.js` with real `fetch` calls — `useDrafts.js`
  and every component above it are already written against Promises, so no
  other file needs to change.
- **Add scheduling:** extend `createDraft` in `draftFactory.js` with a
  `scheduledFor` field and surface a date/time input in `PostComposer.jsx`.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| `vite: command not found` | Run `npm install` again inside `post-composer/`. |
| Blank page in browser | Check the terminal for errors; make sure you're visiting the exact URL Vite printed (port may differ if 5173 is busy). |
| Drafts disappeared | They're per-browser/per-profile `localStorage`. Incognito windows and browser data clears will remove them. |
| "Simulated network error" toast | Expected behavior — the service randomly fails ~8% of calls. Just retry the action. |
