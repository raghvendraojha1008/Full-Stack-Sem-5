import { useMemo } from 'react';

/**
 * hooks/useCharacterLimit.js
 * Given the current text and the list of currently selected platform
 * configs, derives the tightest (smallest) limit in play, remaining
 * characters against it, and a status band used for styling the
 * character meter ('ok' | 'warning' | 'over').
 */
export function useCharacterLimit(text, selectedPlatformConfigs) {
  return useMemo(() => {
    if (selectedPlatformConfigs.length === 0) {
      return {
        limit: null,
        remaining: null,
        status: 'ok',
        tightestPlatform: null
      };
    }

    const tightestPlatform = selectedPlatformConfigs.reduce((tightest, platform) =>
      platform.charLimit < tightest.charLimit ? platform : tightest
    );

    const remaining = tightestPlatform.charLimit - text.length;
    let status = 'ok';
    if (remaining < 0) status = 'over';
    else if (remaining <= tightestPlatform.charLimit * 0.1) status = 'warning';

    return {
      limit: tightestPlatform.charLimit,
      remaining,
      status,
      tightestPlatform
    };
  }, [text, selectedPlatformConfigs]);
}
