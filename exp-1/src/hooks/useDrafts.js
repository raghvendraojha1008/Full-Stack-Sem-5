import { useState, useEffect, useCallback } from 'react';
import { draftService } from '../services/draftService.js';
import { createDraft, touchDraft } from '../patterns/draftFactory.js';

/**
 * hooks/useDrafts.js
 * Encapsulates all draft CRUD logic and the loading/error state that
 * comes with talking to the (simulated) backend. Components consume
 * this hook instead of talking to draftService directly, keeping the
 * async plumbing in one reusable place.
 */
export function useDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingIds, setPendingIds] = useState(() => new Set());

  const setPending = (id, isPending) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (isPending) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await draftService.list();
      setDrafts(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveDraft = useCallback(async (draftInput) => {
    const draft = draftInput.id
      ? touchDraft(draftInput, {})
      : createDraft(draftInput);

    setPending(draft.id, true);
    setError(null);
    try {
      const saved = await draftService.save(draft);
      setDrafts((prev) => {
        const exists = prev.some((d) => d.id === saved.id);
        return exists
          ? prev.map((d) => (d.id === saved.id ? saved : d))
          : [saved, ...prev];
      });
      return saved;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setPending(draft.id, false);
    }
  }, []);

  const deleteDraft = useCallback(async (draftId) => {
    setPending(draftId, true);
    setError(null);
    try {
      await draftService.remove(draftId);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setPending(draftId, false);
    }
  }, []);

  const publishDraft = useCallback(async (draft) => {
    setPending(draft.id, true);
    setError(null);
    try {
      const result = await draftService.publish(draft);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setPending(draft.id, false);
    }
  }, []);

  return {
    drafts,
    isLoading,
    error,
    pendingIds,
    refresh,
    saveDraft,
    deleteDraft,
    publishDraft
  };
}
