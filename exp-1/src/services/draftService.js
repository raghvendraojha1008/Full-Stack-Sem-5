/**
 * services/draftService.js
 * --------------------------
 * Simulates a real backend for saving/loading/deleting/publishing drafts.
 * Under the hood it persists to localStorage (so drafts survive a page
 * reload) but every method returns a Promise with artificial network
 * latency and a small, configurable chance of failure — this lets the
 * UI layer practice real async patterns (loading state, error state,
 * retries) without needing an actual server for this experiment.
 */

const STORAGE_KEY = 'post-composer:drafts';
const SIMULATED_LATENCY_MS = 500;
const SIMULATED_FAILURE_RATE = 0.08; // ~8% of requests "fail"

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStore(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail(actionLabel) {
  if (Math.random() < SIMULATED_FAILURE_RATE) {
    throw new Error(`Simulated network error while ${actionLabel}. Please try again.`);
  }
}

export const draftService = {
  async list() {
    await delay(SIMULATED_LATENCY_MS);
    maybeFail('loading drafts');
    return readStore().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async save(draft) {
    await delay(SIMULATED_LATENCY_MS);
    maybeFail('saving the draft');
    const drafts = readStore();
    const index = drafts.findIndex((d) => d.id === draft.id);
    if (index >= 0) {
      drafts[index] = draft;
    } else {
      drafts.push(draft);
    }
    writeStore(drafts);
    return draft;
  },

  async remove(draftId) {
    await delay(SIMULATED_LATENCY_MS);
    maybeFail('deleting the draft');
    const drafts = readStore().filter((d) => d.id !== draftId);
    writeStore(drafts);
    return draftId;
  },

  async publish(draft) {
    await delay(SIMULATED_LATENCY_MS * 1.5);
    maybeFail('publishing the post');
    // In a real app this would hit each platform's API. Here we just
    // resolve with a fabricated confirmation per selected platform.
    return draft.platformIds.map((platformId) => ({
      platformId,
      status: 'published',
      publishedAt: new Date().toISOString()
    }));
  }
};
