import { useState } from 'react'
import { api } from '../api.js'
import { ms, number, percentile } from '../format.js'

const TARGETS = {
  analytics: {
    label: 'Dashboard analytics',
    uncached: () => api.analytics({ cached: false, silent: true }),
    cached: () => api.analytics({ cached: true, silent: true }),
  },
  feed: {
    label: 'Post feed, page 4 sorted by likes',
    uncached: () => api.posts({ page: 3, size: 20, sort: 'likes,desc', cached: false, silent: true }),
    cached: () => api.posts({ page: 3, size: 20, sort: 'likes,desc', cached: true, silent: true }),
  },
}

async function runBatch(call, total, concurrency) {
  const times = []
  let failed = 0
  let next = 0
  const started = performance.now()

  async function worker() {
    while (next < total) {
      next += 1
      try {
        const { ms: took } = await call()
        times.push(took)
      } catch {
        failed += 1
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))
  const seconds = (performance.now() - started) / 1000
  const sorted = [...times].sort((a, b) => a - b)
  return {
    total,
    failed,
    average: sorted.length ? sorted.reduce((sum, t) => sum + t, 0) / sorted.length : 0,
    median: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    throughput: seconds > 0 ? total / seconds : 0,
  }
}

export default function Benchmark() {
  const [target, setTarget] = useState('analytics')
  const [total, setTotal] = useState(50)
  const [concurrency, setConcurrency] = useState(5)
  const [phase, setPhase] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function start() {
    setError('')
    setResult(null)
    const chosen = TARGETS[target]
    const silent = { silent: true }
    try {
      setPhase('Clearing the cache and running without it...')
      await api.clearCache(silent)
      const uncached = await runBatch(chosen.uncached, total, concurrency)

      setPhase('Running the same requests through a cold cache...')
      await api.clearCache(silent)
      const cached = await runBatch(chosen.cached, total, concurrency)

      setResult({ label: chosen.label, uncached, cached })
    } catch (e) {
      setError(e.message)
    } finally {
      setPhase('')
    }
  }

  const speedUp = result && result.cached.average > 0 ? result.uncached.average / result.cached.average : 0
  const slowest = result ? Math.max(result.uncached.average, result.cached.average, 1) : 1

  return (
    <section>
      <header className="view-head">
        <h1>Benchmark</h1>
        <p>
          A small load test that runs in your browser: the same number of requests with the cache skipped, then
          with the cache on. For a full test with Apache JMeter, use the plan in{' '}
          <code>backend/jmeter/read-api-benchmark.jmx</code>.
        </p>
      </header>

      <div className="toolbar">
        <label className="field">
          <span>Endpoint</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)} disabled={!!phase}>
            {Object.entries(TARGETS).map(([id, item]) => (
              <option key={id} value={id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Requests per run</span>
          <select value={total} onChange={(e) => setTotal(Number(e.target.value))} disabled={!!phase}>
            {[20, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Parallel users</span>
          <select value={concurrency} onChange={(e) => setConcurrency(Number(e.target.value))} disabled={!!phase}>
            {[1, 5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button className="button primary" onClick={start} disabled={!!phase}>
          {phase ? 'Running...' : 'Start benchmark'}
        </button>
      </div>

      {phase && (
        <p className="muted" role="status">
          {phase}
        </p>
      )}
      {error && (
        <div className="notice is-error" role="alert">
          {error}
        </div>
      )}

      {!result && !phase && !error && (
        <p className="muted">Pick an endpoint and press Start benchmark. It takes a few seconds.</p>
      )}

      {result && (
        <>
          <p className="verdict">
            {speedUp >= 1.2
              ? `With the cache on, the average answer arrived ${speedUp.toFixed(1)} times faster.`
              : 'The cache made little difference here, because the uncached query is already very fast on this small database.'}
          </p>
          <div className="two-up">
            {[
              { key: 'uncached', title: 'Without cache', data: result.uncached, tone: 'is-slow' },
              { key: 'cached', title: 'With cache', data: result.cached, tone: '' },
            ].map(({ key, title, data, tone }) => (
              <article key={key} className="lab-panel">
                <h2>{title}</h2>
                <p className="big-number">
                  {ms(data.average)}
                  <span> average</span>
                </p>
                <div className="meter tall">
                  <span className={tone} style={{ width: `${Math.max(1.5, (data.average / slowest) * 100)}%` }} />
                </div>
                <dl className="facts">
                  <div>
                    <dt>Median</dt>
                    <dd>{ms(data.median)}</dd>
                  </div>
                  <div>
                    <dt>95th percentile</dt>
                    <dd>{ms(data.p95)}</dd>
                  </div>
                  <div>
                    <dt>Fastest</dt>
                    <dd>{ms(data.min)}</dd>
                  </div>
                  <div>
                    <dt>Slowest</dt>
                    <dd>{ms(data.max)}</dd>
                  </div>
                  <div>
                    <dt>Throughput</dt>
                    <dd>{data.throughput.toFixed(1)} requests a second</dd>
                  </div>
                  <div>
                    <dt>Failed</dt>
                    <dd>
                      {number(data.failed)} of {number(data.total)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
