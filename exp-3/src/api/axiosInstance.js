// This shows the Axios Interceptor pattern from the experiment sheet.
// Replace `baseURL` with your real backend once you have one (e.g. a
// Firebase Cloud Function or your own Node/Express API) that verifies the
// Firebase ID token on incoming requests.

import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://example.com/api",
});

// REQUEST INTERCEPTOR
// Runs before every request leaves the browser. Grabs the current user's
// fresh Firebase ID token and attaches it as "Authorization: Bearer <token>".
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR
// If the backend rejects a request with 401 (token expired / invalid),
// force Firebase to issue a brand-new token and retry the request ONCE.
// This is the "Token Expiry and Refresh Mechanism" from the experiment.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const currentUser = auth.currentUser;

      if (currentUser) {
        const freshToken = await currentUser.getIdToken(true); // force refresh
        originalRequest.headers.Authorization = `Bearer ${freshToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
