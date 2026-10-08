import { useEffect, useState } from 'react'
import { onRequest } from '../api.js'
import { ms } from '../format.js'

const MAX_ROWS = 14

function speedClass(entry) {
  if (entry.status === 0 || entry.status >= 400) return 'is-error'
  if (entry.cache === 'HIT') return 'is-fast'
  if (entry.ms < 60) return 'is-fast'
  if (entry.ms < 200) return 'is-medium'
  return 'is-slow'
}

function cacheLabel(entry) {
  if (entry.status === 0) return 'no answer'
  if (entry.status >= 400) return `error ${entry.status}`
  if (entry.cache === 'HIT') return 'from cache'
  if (entry.cache === 'MISS') return 'from database, now cached'
  if (entry.cache === 'BYPASS') return 'cache skipped'
  return 'from database'
}

export default function RequestTape() {
  const [entries, setEntries] = useState([])

  useEffect(
    () => onRequest((entry) => setEntries((current) => [entry, ...current].slice(0, MAX_ROWS))),
    [],
  )

  const scale = Math.max(300, ...entries.map((entry) => entry.ms))

  return (
    <aside className="tape" aria-label="Recent requests">
      <div className="tape-head">
        <h2>Request tape</h2>
        {entries.length > 0 && (
          <button className="link-button" onClick={() => setEntries([])}>
            Clear
          </button>
        )}
      </div>
      <p className="tape-note">Every call the page makes, newest first. Bar length is the time to get a full answer.</p>

      {entries.length === 0 ? (
        <p className="tape-empty">Nothing yet. Open the post feed or press a button to send the first request.</p>
      ) : (
        <ol className="tape-list" aria-live="polite">
          {entries.map((entry) => (
            <li key={entry.id} className="tape-row">
              <div className="tape-line">
                <span className="tape-path" title={entry.path}>
                  <span className="tape-method">{entry.method}</span> {entry.path.replace('/api', '')}
                </span>
                <span className="tape-ms">{ms(entry.ms)}</span>
              </div>
              <div className="tape-bar">
                <span className={`tape-fill ${speedClass(entry)}`} style={{ width: `${Math.max(2, (entry.ms / scale) * 100)}%` }} />
              </div>
              <span className="tape-source">{cacheLabel(entry)}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
