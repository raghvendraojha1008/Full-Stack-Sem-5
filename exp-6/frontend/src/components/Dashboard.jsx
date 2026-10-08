import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'
import { ms, number, time } from '../format.js'

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [top, setTop] = useState([])
  const [stats, setStats] = useState([])
  const [last, setLast] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const refreshStats = useCallback(() => api.cacheStats().then(({ data }) => setStats(data)).catch(() => {}), [])

  const loadAnalytics = useCallback(
    async (cached) => {
      setBusy(true)
      try {
        const result = await api.analytics({ cached })
        setAnalytics(result.data)
        setLast({ ms: result.ms, cache: result.cache })
        setError('')
      } catch (e) {
        setError(e.message)
      } finally {
        setBusy(false)
        refreshStats()
      }
    },
    [refreshStats],
  )

  useEffect(() => {
    loadAnalytics(true)
    api.topPosts(5).then(({ data }) => setTop(data)).catch(() => {}).finally(refreshStats)
  }, [loadAnalytics, refreshStats])

  async function clearCaches() {
    await api.clearCache()
    setLast(null)
    refreshStats()
  }

  const maxLikes = analytics ? Math.max(1, ...analytics.topAuthors.map((a) => a.totalLikes)) : 1

  return (
    <section>
      <header className="view-head">
        <h1>Dashboard</h1>
        <p>
          These totals come from several aggregate queries, so the server keeps the result in an Ehcache for two
          minutes. The first load is slow, repeat loads are answered from memory.
        </p>
      </header>

      <div className="actions">
        <button className="button primary" disabled={busy} onClick={() => loadAnalytics(true)}>
          Reload from cache
        </button>
        <button className="button" disabled={busy} onClick={() => loadAnalytics(false)}>
          Recompute without cache
        </button>
        <button className="button" onClick={clearCaches}>
          Clear all caches
        </button>
      </div>

      {error && (
        <div className="notice is-error" role="alert">
          {error}
        </div>
      )}

      {analytics && (
        <>
          <p className="freshness" aria-live="polite">
            Numbers computed at <strong>{time(analytics.computedAt)}</strong>.
            {last && (
              <>
                {' '}
                Last answer took <strong>{ms(last.ms)}</strong>
                {last.cache === 'HIT' && ', served from the cache. The computed time did not change.'}
                {last.cache === 'MISS' && ', computed from the database and stored in the cache.'}
                {last.cache === 'BYPASS' && ', recomputed because the cache was skipped.'}
              </>
            )}
          </p>

          <dl className="ledger">
            <div>
              <dt>Posts</dt>
              <dd>{number(analytics.totalPosts)}</dd>
            </div>
            <div>
              <dt>Comments</dt>
              <dd>{number(analytics.totalComments)}</dd>
            </div>
            <div>
              <dt>Authors</dt>
              <dd>{number(analytics.totalAuthors)}</dd>
            </div>
            <div>
              <dt>Likes</dt>
              <dd>{number(analytics.totalLikes)}</dd>
            </div>
            <div>
              <dt>Views</dt>
              <dd>{number(analytics.totalViews)}</dd>
            </div>
            <div>
              <dt>Average likes per post</dt>
              <dd>{analytics.averageLikesPerPost}</dd>
            </div>
          </dl>

          <div className="two-up">
            <div>
              <h2>Most liked authors</h2>
              <ul className="bars">
                {analytics.topAuthors.map((author) => (
                  <li key={author.authorId}>
                    <div className="bars-line">
                      <span>{author.authorName}</span>
                      <span>
                        {number(author.totalLikes)} likes from {number(author.postCount)} posts
                      </span>
                    </div>
                    <div className="meter">
                      <span style={{ width: `${(author.totalLikes / maxLikes) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Top posts</h2>
              <p className="muted small">One native SQL query joins posts and authors and sorts by likes.</p>
              <ol className="ranking">
                {top.map((post) => (
                  <li key={post.id}>
                    <span className="ranking-title">{post.title}</span>
                    <span className="muted small">
                      {post.authorName}, {number(post.likes)} likes
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </>
      )}

      <h2>Cache activity</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Cache</th>
            <th scope="col">Requests</th>
            <th scope="col">Hits</th>
            <th scope="col">Misses</th>
            <th scope="col">Hit ratio</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row) => (
            <tr key={row.cache}>
              <th scope="row">{row.cache}</th>
              <td>{number(row.requests)}</td>
              <td>{number(row.hits)}</td>
              <td>{number(row.misses)}</td>
              <td>{row.requests === 0 ? 'no requests' : `${Math.round(row.hitRatio * 100)}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="link-button" onClick={refreshStats}>
        Refresh counters
      </button>
    </section>
  )
}
