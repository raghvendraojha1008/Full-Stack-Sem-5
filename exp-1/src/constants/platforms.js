/**
 * constants/platforms.js
 * ----------------------
 * Single source of truth for every platform the composer supports.
 * Each entry carries display info + hard constraints. Adding a new
 * platform is a one-object change here plus a matching validation
 * strategy in patterns/validationStrategies.js — nothing else in the
 * component tree needs to know a new platform exists.
 */

export const PLATFORMS = {
  twitter: {
    id: 'twitter',
    label: 'X / Twitter',
    shortLabel: 'X',
    charLimit: 280,
    accent: '#4aa3e0',
    supportsMedia: true,
    maxMedia: 4,
    hashtagAdvice: 'Keep it to 1–2 hashtags — more reads as noise.'
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    shortLabel: 'in',
    charLimit: 3000,
    accent: '#3c8ec7',
    supportsMedia: true,
    maxMedia: 9,
    hashtagAdvice: '3–5 hashtags is the sweet spot for reach.'
  },
  instagram: {
    id: 'instagram',
    label: 'Instagram',
    shortLabel: 'IG',
    charLimit: 2200,
    accent: '#e1306c',
    supportsMedia: true,
    maxMedia: 10,
    hashtagAdvice: 'Up to 30 hashtags allowed; 8–15 tends to perform best.'
  }
};

export const PLATFORM_LIST = Object.values(PLATFORMS);

export const DRAFT_STATUS = {
  DRAFT: 'draft',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error'
};
