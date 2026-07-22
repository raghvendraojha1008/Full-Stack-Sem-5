import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => onDismiss(), 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.tone}`} role="status">
      <span className="toast__dot" aria-hidden="true" />
      <span className="toast__message">{toast.message}</span>
      <button className="toast__close" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
