/**
 * patterns/validationStrategies.js
 * ---------------------------------
 * STRATEGY PATTERN
 * Each platform gets its own validation "strategy" — a small function
 * with an identical signature (content, platformConfig, selectedPlatforms)
 * that returns a list of { field, message, severity } issues.
 *
 * PostComposer never branches on "if platform === 'twitter'"; it simply
 * looks up the right strategy from the registry and runs it. This keeps
 * the composer open to new platforms (open/closed principle) and keeps
 * each platform's quirky rules isolated and independently testable.
 */

const baseLengthCheck = (content, platform) => {
  const issues = [];
  const length = content.text.length;

  if (length === 0) {
    issues.push({
      field: 'text',
      message: 'Write something before adding this platform.',
      severity: 'error'
    });
    return issues;
  }

  if (length > platform.charLimit) {
    issues.push({
      field: 'text',
      message: `${length - platform.charLimit} characters over the ${platform.charLimit} limit for ${platform.label}.`,
      severity: 'error'
    });
  } else if (length > platform.charLimit * 0.9) {
    issues.push({
      field: 'text',
      message: `Close to the ${platform.charLimit}-character limit for ${platform.label}.`,
      severity: 'warning'
    });
  }

  return issues;
};

const mediaCheck = (content, platform) => {
  const issues = [];
  const mediaCount = content.media?.length ?? 0;

  if (mediaCount > platform.maxMedia) {
    issues.push({
      field: 'media',
      message: `${platform.label} allows up to ${platform.maxMedia} attachments (${mediaCount} added).`,
      severity: 'error'
    });
  }

  return issues;
};

/** Twitter/X: strict on length, tolerant on everything else. */
const twitterStrategy = (content, platform) => [
  ...baseLengthCheck(content, platform),
  ...mediaCheck(content, platform)
];

/** LinkedIn: generous length, but nudges toward a line-break-friendly opener. */
const linkedinStrategy = (content, platform) => {
  const issues = [...baseLengthCheck(content, platform), ...mediaCheck(content, platform)];
  const firstLine = content.text.split('\n')[0] ?? '';

  if (firstLine.length > 150) {
    issues.push({
      field: 'text',
      message: 'Long opening line — LinkedIn truncates the preview around 150 characters.',
      severity: 'warning'
    });
  }

  return issues;
};

/** Instagram: requires at least one media attachment, generous caption length. */
const instagramStrategy = (content, platform) => {
  const issues = [...baseLengthCheck(content, platform), ...mediaCheck(content, platform)];
  const mediaCount = content.media?.length ?? 0;

  if (mediaCount === 0) {
    issues.push({
      field: 'media',
      message: 'Instagram posts need at least one image or video.',
      severity: 'error'
    });
  }

  return issues;
};

export const VALIDATION_STRATEGIES = {
  twitter: twitterStrategy,
  linkedin: linkedinStrategy,
  instagram: instagramStrategy
};

/**
 * Runs the correct strategy for a single platform.
 * Falls back to the base length check if a platform has no bespoke strategy,
 * so a newly-added platform without a strategy yet still degrades safely.
 */
export function validateForPlatform(content, platform) {
  const strategy = VALIDATION_STRATEGIES[platform.id] ?? baseLengthCheck;
  return strategy(content, platform);
}

/**
 * Runs validation across every currently-selected platform and
 * returns a map of platformId -> issues[].
 */
export function validateAll(content, selectedPlatformConfigs) {
  return selectedPlatformConfigs.reduce((acc, platform) => {
    acc[platform.id] = validateForPlatform(content, platform);
    return acc;
  }, {});
}
