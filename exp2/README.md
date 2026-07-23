# Redux Toolkit Content State Manager
### Unit 1 – Experiment 2: Redux-Based Content State Management

A React + Redux Toolkit app implementing everything from the experiment sheet:

- `createSlice` for posts / platforms / UI state
- `createAsyncThunk` for simulated API fetching (pending / fulfilled / rejected)
- `createEntityAdapter` for normalized post state (`{ ids: [], entities: {} }`)
- Flat state design: `posts`, `platforms`, `ui` are separate top-level slices
- Memoized selectors with `createSelector` (from Redux Toolkit's built-in `reselect`)
- Performance optimization with `React.memo`, `useMemo`, `useCallback`

Covers Assignments 1–5 from the experiment brief (see "Where each assignment lives" below).

---

## 1. Prerequisites (Windows 11)

You only need **Node.js** (which includes `npm`).

1. Go to https://nodejs.org and download the **LTS** installer for Windows.
2. Run the installer, keep the default options, and finish the install.
3. Confirm it worked — open **PowerShell** (or Command Prompt) and run:

   ```powershell
   node -v
   npm -v
   ```

   You should see version numbers (e.g. `v22.x.x` and `10.x.x`). If you see an
   error instead, restart your PC (this refreshes the PATH) and try again.

---

## 2. Unzip and install

1. Right-click the downloaded `redux-toolkit-project.zip` → **Extract All…**
   and choose a folder (e.g. `C:\Users\<you>\Projects\redux-toolkit-project`).
2. Open PowerShell in that folder:
   - Open the extracted folder in File Explorer.
   - Click the address bar, type `powershell`, press Enter.
     (This opens PowerShell already pointed at that folder.)
3. Install dependencies:

   ```powershell
   npm install
   ```

   This reads `package.json` and downloads React, Redux Toolkit, etc. into a
   new `node_modules` folder. It only needs to be done once (or again if you
   ever delete `node_modules`).

---

## 3. Run it

```powershell
npm run dev
```

You'll see output like:

```
  VITE ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

Open that URL in your browser (Ctrl+Click the link, or copy-paste it into
Chrome/Edge). The app loads with 4 sample posts and 3 platforms already
fetched via a simulated async API call.

To stop the dev server, click into the PowerShell window and press `Ctrl + C`.

---

## 4. Build a production version (optional)

```powershell
npm run build
```

This creates an optimized static build in a new `dist` folder. You can preview
that build locally with:

```powershell
npm run preview
```

---

## 5. What you can do in the app

- **Add a post** — fill in author, platform, and content, then "Add Post".
- **Filter posts** — by platform, or restrict to posts under 100 characters
  (this exercises the memoized `selectVisiblePosts` selector).
- **Delete a post** — removes it from normalized state via `createEntityAdapter`.
- Reload the page to see the `fetchPosts` / `fetchPlatforms` thunks re-run
  (open DevTools → Network/Console to see the simulated 800ms/400ms delay).

---

## 6. Project structure

```
src/
  api/
    mockApi.js              # simulated backend (fetchPostsFromServer, etc.)
  app/
    store.js                # configureStore — combines all slices
  features/
    posts/
      postsSlice.js         # createSlice + createAsyncThunk + createEntityAdapter
      postsSelectors.js     # createSelector-based memoized/derived selectors
    platforms/
      platformsSlice.js     # simple async-loaded list slice
    ui/
      uiSlice.js            # UI-only state (filters), separate from data state
  components/
    AddPostForm.jsx
    FilterBar.jsx
    PostList.jsx             # React.memo + useMemo + useCallback
  App.jsx
  main.jsx                   # wraps <App /> in <Provider store={store}>
```

## 7. Where each assignment lives

| Assignment | File(s) |
|---|---|
| 1. Redux Slice Implementation (add/update/delete + React connection) | `postsSlice.js` (`addPost`, `updatePost`, `deletePost`), `AddPostForm.jsx`, `PostList.jsx` |
| 2. Async Data Handling (createAsyncThunk, loading/error states) | `postsSlice.js` (`fetchPosts`), `platformsSlice.js` (`fetchPlatforms`), `mockApi.js`, rendered in `PostList.jsx` |
| 3. State Normalization (createEntityAdapter) | `postsSlice.js` (`postsAdapter`, `postsSelectors`) |
| 4. Selector Optimization (createSelector / memoization) | `postsSelectors.js` (`selectVisiblePosts`, `selectPostCountByPlatform`) |
| 5. Performance Optimization (React.memo, useMemo, useCallback) | `PostList.jsx` (`PostItem` wrapped in `React.memo`, `platformNameById` via `useMemo`, `handleDelete` via `useCallback`) |

To *see* the re-render optimization in action: uncomment the
`console.log("Rendering post:", post.id)` line inside `PostItem` in
`PostList.jsx`, open the browser console, then add/delete a post or change a
filter — only the posts that actually changed will log, not the whole list.

---

## 8. Troubleshooting

- **"npm is not recognized"** → Node.js isn't installed or PATH wasn't
  refreshed. Reinstall Node.js from nodejs.org and restart your PC.
- **Port 5173 already in use** → close whatever is using it, or run
  `npm run dev -- --port 5174` to use a different port.
- **Blank page / errors in browser console** → make sure `npm install`
  finished without errors, and that you're running commands from inside the
  extracted project folder (the one containing `package.json`).
