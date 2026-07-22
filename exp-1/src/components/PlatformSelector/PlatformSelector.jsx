import { PLATFORM_LIST } from '../../constants/platforms.js';
import './PlatformSelector.css';

/**
 * Controlled component: selectedIds + onChange are owned by the parent
 * (PostComposer). This component renders pure UI and reports intent.
 */
export default function PlatformSelector({ selectedIds, onChange, issuesByPlatform }) {
  const toggle = (platformId) => {
    const isSelected = selectedIds.includes(platformId);
    const next = isSelected
      ? selectedIds.filter((id) => id !== platformId)
      : [...selectedIds, platformId];
    onChange(next);
  };

  return (
    <div className="platform-selector" role="group" aria-label="Select platforms to post to">
      {PLATFORM_LIST.map((platform) => {
        const isSelected = selectedIds.includes(platform.id);
        const issues = issuesByPlatform?.[platform.id] ?? [];
        const hasError = issues.some((i) => i.severity === 'error');
        const hasWarning = issues.some((i) => i.severity === 'warning');

        return (
          <button
            key={platform.id}
            type="button"
            className={[
              'platform-chip',
              isSelected && 'platform-chip--selected',
              isSelected && hasError && 'platform-chip--error',
              isSelected && !hasError && hasWarning && 'platform-chip--warning'
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--platform-accent': platform.accent }}
            aria-pressed={isSelected}
            onClick={() => toggle(platform.id)}
          >
            <span className="platform-chip__badge">{platform.shortLabel}</span>
            <span className="platform-chip__label">{platform.label}</span>
            <span className="platform-chip__limit">{platform.charLimit} chars</span>
          </button>
        );
      })}
    </div>
  );
}
