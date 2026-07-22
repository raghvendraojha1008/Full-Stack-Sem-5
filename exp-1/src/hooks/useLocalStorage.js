import { useState, useEffect } from 'react';

/**
 * hooks/useLocalStorage.js
 * A small reusable hook that mirrors a piece of React state into
 * localStorage under the given key, restoring it on mount.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can fail (quota, private mode) — non-fatal for this app.
    }
  }, [key, value]);

  return [value, setValue];
}
