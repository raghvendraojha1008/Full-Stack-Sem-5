/**
 * patterns/draftFactory.js
 * -------------------------
 * FACTORY PATTERN
 * Centralizes the shape of a "draft" so every draft created anywhere in
 * the app (new draft, duplicate draft, imported draft) is structurally
 * identical. If the draft schema ever changes (e.g. adding scheduling),
 * this is the one place that needs to change.
 */

let sequence = 0;

function generateId() {
  sequence += 1;
  return `draft_${Date.now()}_${sequence}`;
}

export function createDraft({
  text = '',
  media = [],
  platformIds = [],
  title = ''
} = {}) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: title || 'Untitled draft',
    text,
    media,
    platformIds,
    createdAt: now,
    updatedAt: now
  };
}

export function cloneDraft(draft) {
  return createDraft({
    text: draft.text,
    media: [...(draft.media ?? [])],
    platformIds: [...(draft.platformIds ?? [])],
    title: `${draft.title} (copy)`
  });
}

export function touchDraft(draft, updates) {
  return {
    ...draft,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}
