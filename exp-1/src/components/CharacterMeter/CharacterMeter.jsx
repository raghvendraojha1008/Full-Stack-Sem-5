import './CharacterMeter.css';

/**
 * The composer's signature element: a "signal strength" radial meter.
 * Frames the character budget as broadcast headroom rather than a plain
 * progress bar — it reads as "how much signal do I have left" which
 * fits the dispatch-desk framing of the whole app.
 */
export default function CharacterMeter({ length, limit, status, tightestPlatform }) {
  if (limit === null) {
    return (
      <div className="char-meter char-meter--empty">
        <span>Select a platform to see its character limit.</span>
      </div>
    );
  }

  const ratio = Math.min(length / limit, 1.15);
  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference * (1 - Math.min(ratio, 1));

  return (
    <div className={`char-meter char-meter--${status}`}>
      <svg viewBox="0 0 64 64" className="char-meter__ring" aria-hidden="true">
        <circle cx="32" cy="32" r="26" className="char-meter__track" />
        <circle
          cx="32"
          cy="32"
          r="26"
          className="char-meter__fill"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="char-meter__readout">
        <span className="char-meter__count">{length}</span>
        <span className="char-meter__limit">/ {limit}</span>
      </div>
      <div className="char-meter__caption">
        {status === 'over' && tightestPlatform && (
          <span>Over {tightestPlatform.label}'s limit by {length - limit}</span>
        )}
        {status === 'warning' && tightestPlatform && (
          <span>Approaching {tightestPlatform.label}'s limit</span>
        )}
        {status === 'ok' && tightestPlatform && (
          <span>Tightest limit: {tightestPlatform.label}</span>
        )}
      </div>
    </div>
  );
}
