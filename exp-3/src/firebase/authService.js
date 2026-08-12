// All the "talk to Firebase" logic lives here, so components stay simple.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Default role given to every new user who signs up.
// Change a user's role manually in the Firebase Console (Firestore) to test
// admin/editor views — see README section 7.
const DEFAULT_ROLE = "viewer";

/**
 * Creates a Firebase Auth account AND a matching Firestore document
 * ( users/{uid} ) that stores that user's role.
 */
export async function signup(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = credential.user;

  await setDoc(doc(db, "users", uid), {
    email,
    role: DEFAULT_ROLE,
  });

  return credential.user;
}

export async function login(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export function logout() {
  return signOut(auth);
}

/**
 * Reads the role for a given user id from Firestore.
 * If no document exists yet (e.g. very first login), it creates one with
 * the default role so the app never breaks on a missing role.
 */
export async function fetchUserRole(uid, email) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data().role ?? DEFAULT_ROLE;
  }

  await setDoc(userRef, { email, role: DEFAULT_ROLE });
  return DEFAULT_ROLE;
}
