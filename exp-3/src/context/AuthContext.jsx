import React from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { fetchUserRole } from "../firebase/authService";
import { decodeJwtPayload } from "../firebase/decodeJwt";

const AuthContext = React.createContext(null);

/**
 * Wrap the whole app in this provider (see main.jsx).
 * It listens to Firebase's auth state and exposes:
 *   - user        -> the Firebase user object (or null if logged out)
 *   - role        -> "admin" | "editor" | "viewer" (from Firestore)
 *   - tokenClaims -> decoded JWT payload (for the "JWT structure" demo)
 *   - loading     -> true while we're still checking auth on page load
 */
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [tokenClaims, setTokenClaims] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // onIdTokenChanged fires on login, logout, AND whenever Firebase silently
    // refreshes the token in the background (Firebase auto-refreshes the
    // ID token roughly every hour - this is the "token refresh mechanism"
    // from the experiment, handled for us by the SDK).
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const token = await firebaseUser.getIdToken();
        setTokenClaims(decodeJwtPayload(token));

        const userRole = await fetchUserRole(firebaseUser.uid, firebaseUser.email);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
        setTokenClaims(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { user, role, tokenClaims, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
