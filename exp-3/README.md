# Role-Based Authentication & Route Protection (Firebase)
### Unit 1 – Experiment 3

A React app implementing everything from the experiment sheet, using
**Firebase** as the backend:

- Login / Signup using Firebase Authentication (issues real JWT tokens)
- JWT structure demo — decodes and displays your actual token payload
- Role-Based Access Control (RBAC) — roles stored in Firestore (`admin` / `editor` / `viewer`)
- Protected Routes — logged-out users get redirected to `/login`
- Role-protected routes — e.g. `/admin` only works for the `admin` role
- Conditional rendering — buttons show/hide based on role permissions
- Axios interceptors — auto-attach the token to every request
- Token refresh handling — Firebase auto-refreshes tokens; a 401-retry pattern is also shown for a real backend

No backend code needs to be written by you — Firebase Authentication +
Firestore together **are** the backend for this project.

---

## Part A — Firebase Console Setup (do this first)

You need a free Firebase project before the app will run.

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com
2. Click **Add project** (or "Create a project").
3. Give it a name, e.g. `rbac-auth-demo`. Click **Continue**.
4. You can disable Google Analytics for this project (not needed) → **Create project**.
5. Wait for it to finish, then click **Continue**.

### 2. Register a Web App
1. On the project's home page, click the **`</>`** (Web) icon to add a web app.
2. Give it a nickname, e.g. `rbac-web`. You do **not** need to check "Firebase Hosting".
3. Click **Register app**.
4. You'll now see a code block with a `firebaseConfig` object like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "rbac-auth-demo.firebaseapp.com",
     projectId: "rbac-auth-demo",
     storageBucket: "rbac-auth-demo.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

   **Keep this tab open** — you'll copy these values into the `.env` file in Part B.
5. Click **Continue to console**.

### 3. Enable Email/Password Authentication
1. In the left sidebar, click **Build → Authentication**.
2. Click **Get started**.
3. Under "Sign-in method", click **Email/Password**.
4. Toggle it **Enable**, then click **Save**.

### 4. Create a Firestore Database
1. In the left sidebar, click **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** → **Next**.
4. Pick any location close to you → **Enable**.

### 5. Set Firestore Security Rules
1. Still in Firestore Database, click the **Rules** tab.
2. Delete everything in the box and paste in the contents of the
   `firestore.rules` file included in this project (open it in Notepad to copy it).
3. Click **Publish**.

   These rules make sure a logged-in user can only read/create **their own**
   role document — nobody can grant themselves "admin" from the browser.

### 6. Promoting a user to "admin" (manual step, for testing)
Every new signup gets the `viewer` role automatically. To test the admin
view:
1. Sign up an account in the running app first (see Part C).
2. In Firebase Console, go to **Build → Firestore Database → Data**.
3. Open the `users` collection → click the document with that user's ID.
4. Change the `role` field value from `viewer` to `admin` → click **Update**.
5. Refresh the app / log out and back in — you'll now see the Admin Panel link.

---

## Part B — Prerequisites & Project Setup (Windows 11)

### 1. Install Node.js
1. Go to https://nodejs.org and download the **LTS** installer.
2. Run it, keep defaults, finish install.
3. Confirm it worked — open **PowerShell** and run:

   ```powershell
   node -v
   npm -v
   ```

   You should see version numbers. If not, restart your PC and try again.

### 2. Unzip and install dependencies
1. Right-click `rbac-firebase-auth.zip` → **Extract All…**.
2. Open the extracted folder in File Explorer, click the address bar, type
   `powershell`, press Enter (opens PowerShell in that folder).
3. Run:

   ```powershell
   npm install
   ```

### 3. Add your Firebase keys
1. In the project folder, find `.env.example`.
2. Make a copy of it and rename the copy to exactly `.env`
   (PowerShell: `copy .env.example .env`).
3. Open `.env` in Notepad and fill in the 6 values using the
   `firebaseConfig` object you copied in Part A, step 2. Example:

   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=rbac-auth-demo.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=rbac-auth-demo
   VITE_FIREBASE_STORAGE_BUCKET=rbac-auth-demo.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

4. Save and close the file. Leave `VITE_API_BASE_URL` blank — it's only
   used if you later connect a real backend server.

---

## Part C — Run the app

```powershell
npm run dev
```

Open the printed link (e.g. `http://localhost:5173`) in your browser.

1. Click **Sign up**, create an account with any email/password (6+ chars).
2. You'll land on the **Dashboard** as a `viewer` — notice only the "View
   content" button is enabled, and the decoded JWT payload is shown at the
   bottom.
3. Try visiting `http://localhost:5173/admin` directly — you'll be redirected
   to the "Access denied" page, because your role isn't `admin`.
4. Go promote yourself to `admin` in the Firebase Console (Part A, step 6),
   then log out and log back in — now `/admin` works and more buttons appear
   on the Dashboard.

To stop the dev server, click into PowerShell and press `Ctrl + C`.

### Build a production version (optional)

```powershell
npm run build
npm run preview
```

---

## Project structure

```
src/
  firebase/
    firebaseConfig.js     # connects to your Firebase project (reads .env)
    authService.js        # signup, login, logout, fetch/create user role
    permissions.js        # RBAC permission map (admin/editor/viewer)
    decodeJwt.js           # decodes a JWT payload for the on-screen demo
  context/
    AuthContext.jsx        # app-wide user/role/loading state
  routes/
    ProtectedRoute.jsx      # blocks page unless logged in
    RoleRoute.jsx            # blocks page unless role is allowed
  api/
    axiosInstance.js         # request/response interceptors (token attach + refresh)
  pages/
    Login.jsx, Signup.jsx, Dashboard.jsx, AdminPanel.jsx, Unauthorized.jsx
  App.jsx                     # all routes wired together
  main.jsx                    # wraps app in <BrowserRouter> + <AuthProvider>
firestore.rules                # paste into Firebase Console → Firestore → Rules
.env.example                   # template for your Firebase keys
```

## Where each assignment lives

| Assignment | File(s) |
|---|---|
| 1. JWT Authentication Flow (login, token, storage) | `authService.js`, `AuthContext.jsx`, `Login.jsx`, `Signup.jsx` |
| 2. Axios Interceptor Integration | `api/axiosInstance.js` |
| 3. RBAC Implementation | `firebase/permissions.js`, `Dashboard.jsx` (button visibility) |
| 4. Protected Routes | `routes/ProtectedRoute.jsx`, `routes/RoleRoute.jsx`, `App.jsx` |
| 5. Token Refresh Mechanism | `AuthContext.jsx` (`onIdTokenChanged`, auto-refresh) + `api/axiosInstance.js` (401 retry with `getIdToken(true)`) |

## Notes for your teacher / viva

- Firebase Authentication issues a **real JWT** — the "Decoded JWT payload"
  box on the Dashboard is that actual token, not a fake example.
- Firebase **automatically refreshes** the ID token in the background
  (roughly every hour); `onIdTokenChanged` in `AuthContext.jsx` is how the
  app stays in sync with that. `axiosInstance.js` additionally shows the
  manual "catch a 401 → force refresh → retry" pattern you'd use with a
  custom backend.
- Roles are **not** stored in the JWT itself here (that would need Firebase
  Admin SDK custom claims, which requires a server). Instead roles are
  stored in Firestore and fetched after login — still fully valid RBAC, just
  a simpler setup for a frontend-only project.

## Troubleshooting

- **Blank page / "Firebase: Error (auth/invalid-api-key)"** → your `.env`
  values are missing or wrong. Double-check Part B step 3, and make sure the
  file is named exactly `.env` (not `.env.txt`).
- **Signup works but role always shows blank** → check that Firestore rules
  were published (Part A step 5) and that Firestore Database was actually
  created (step 4).
- **"npm is not recognized"** → reinstall Node.js and restart your PC.
- **Changes to `.env` don't seem to apply** → stop the dev server (Ctrl+C)
  and run `npm run dev` again; Vite only reads `.env` on startup.
