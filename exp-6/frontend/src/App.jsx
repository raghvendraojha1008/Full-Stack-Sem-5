import { useState } from 'react'
import PostsFeed from './components/PostsFeed.jsx'
import Dashboard from './components/Dashboard.jsx'
import QueryLab from './components/QueryLab.jsx'
import Benchmark from './components/Benchmark.jsx'
import RequestTape from './components/RequestTape.jsx'

const VIEWS = [
  { id: 'feed', label: 'Post feed', hint: 'Pagination and sorting' },
  { id: 'dashboard', label: 'Dashboard', hint: 'Cached analytics' },
  { id: 'lab', label: 'Query lab', hint: 'N+1 and JOIN FETCH' },
  { id: 'benchmark', label: 'Benchmark', hint: 'Before and after caching' },
]

export default function App() {
  const [view, setView] = useState('feed')

  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand">
          <span className="brand-name">Read API Lab</span>
          <span className="brand-sub">Experiment 6, scalable read APIs</span>
        </div>
        <nav aria-label="Sections">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'is-active' : ''}`}
              aria-current={view === item.id ? 'page' : undefined}
              onClick={() => setView(item.id)}
            >
              <span className="nav-label">{item.label}</span>
              <span className="nav-hint">{item.hint}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        {view === 'feed' && <PostsFeed />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'lab' && <QueryLab />}
        {view === 'benchmark' && <Benchmark />}
      </main>

      <RequestTape />
    </div>
  )
}
