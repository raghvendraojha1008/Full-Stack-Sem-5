import { useMemo } from 'react';

export const useTextStats = (text, maxLength) => {
  return useMemo(() => {
    const charCount = text.length;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    return {
      charCount,
      wordCount,
      remaining: maxLength - charCount,
      progress: Math.min((charCount / maxLength) * 100, 100),
      isOverLimit: charCount > maxLength
    };
  }, [text, maxLength]);
};
