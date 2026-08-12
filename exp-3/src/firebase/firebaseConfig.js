// Initializes the connection to YOUR Firebase project.
// All the actual values come from the .env file (never hard-code keys here).
// See README.md "Firebase Console Setup" section for how to get these values.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// auth  -> handles login/signup/logout and issues JWT-style ID tokens
// db    -> Firestore database, used here to store each user's "role"
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
