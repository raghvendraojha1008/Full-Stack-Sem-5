import { useState } from 'react'
import { api } from '../api.js'
import { ms, number } from '../format.js'

const STRATEGIES = [
  {
    id: 'lazy',
    title: 'Lazy loading',
    summary: 'Loads the posts first, then asks the database again for the comments of every post and for each new author.',
    code: 'List<Post> posts = postRepository.findAll();\nposts.forEach(p -> p.getComments().size());',
    run: () => api.lazyDemo(),
  },
  {
    id: 'fetch',
    title: 'JOIN FETCH',
    summary: 'Asks for posts, authors and comments in one statement, so the database is visited once.',
    code: '@Query("SELECT DISTINCT p FROM Post p\n  JOIN FETCH p.author\n  LEFT JOIN FETCH p.comments")\nList<Post> findAllWithComments();',
    run: () => api.joinFetchDemo(),
  },
]

export default function QueryLab() {
  const [results, setResults] = useState({})
  const [running, setRunning] = useState(null)
  const [error, setError] = useState('')

  async function run(strategy) {
    setRunning(strategy.id)
    setError('')
    try {
      const { data } = await strategy.run()
      setResults((current) => ({ ...current, [strategy.id]: data }))
    } catch (e) {
      setError(e.message)
    } finally {
      setRunning(null)
    }
  }

  const lazy = results.lazy
  const fetched = results.fetch
  const maxStatements = Math.max(1, lazy?.sqlStatements ?? 0, fetched?.sqlStatements ?? 0)

  return (
    <section>
      <header className="view-head">
        <h1>Query lab</h1>
        <p>
          Both buttons read every post together with its comments. The only difference is how the data is fetched.
          Run them one at a time, because the statement counter is shared by the whole server.
        </p>
      </header>

      {error && (
        <div className="notice is-error" role="alert">
          {error}
        </div>
      )}

      <div className="two-up">
        {STRATEGIES.map((strategy) => {
          const result = results[strategy.id]
          return (
            <article key={strategy.id} className="lab-panel">
              <h2>{strategy.title}</h2>
              <p>{strategy.summary}</p>
              <pre className="code">{strategy.code}</pre>
              <button className="button primary" disabled={running !== null} onClick={() => run(strategy)}>
                {running === strategy.id ? 'Running...' : `Run ${strategy.title.toLowerCase()}`}
              </button>

              {result && (
                <div className="lab-result">
                  <p className="big-number">
                    {number(result.sqlStatements)}
                    <span> SQL statements</span>
                  </p>
                  <div className="meter tall">
                    <span
                      className={strategy.id === 'lazy' ? 'is-slow' : ''}
                      style={{ width: `${Math.max(1.5, (result.sqlStatements / maxStatements) * 100)}%` }}
                    />
                  </div>
                  <p>
                    Server time <strong>{ms(result.durationMs)}</strong> for {number(result.posts)} posts and{' '}
                    {number(result.comments)} comments.
                  </p>
                  <ul className="sample">
                    {result.sample.map((post, index) => (
                      <li key={index}>
                        {post.title} <span className="muted">by {post.authorName}, {post.comments} comments</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {lazy && fetched && (
        <p className="verdict">
          JOIN FETCH used {number(fetched.sqlStatements)} statement{fetched.sqlStatements === 1 ? '' : 's'} instead of{' '}
          {number(lazy.sqlStatements)} and finished {lazy.durationMs > fetched.durationMs
            ? `${(lazy.durationMs / Math.max(1, fetched.durationMs)).toFixed(1)} times faster`
            : 'in a similar time on this small in-memory database'}
          . On a real database across a network, each extra statement also adds a round trip.
        </p>
      )}
    </section>
  )
}
