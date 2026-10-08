import { useEffect, useRef, useState } from 'react'
import { api } from '../api.js'
import { date, number } from '../format.js'
import PostModal from './PostModal.jsx'
import NewPostForm from './NewPostForm.jsx'

const SORTS = [
  { field: 'createdAt', label: 'Newest', defaultDir: 'desc' },
  { field: 'likes', label: 'Most liked', defaultDir: 'desc' },
  { field: 'views', label: 'Most viewed', defaultDir: 'desc' },
  { field: 'title', label: 'Title', defaultDir: 'asc' },
]
const PAGE_SIZES = [5, 10, 20, 50]

function pageWindow(current, total) {
  const span = 5
  let start = Math.max(0, current - Math.floor(span / 2))
  const end = Math.min(total, start + span)
  start = Math.max(0, end - span)
  return Array.from({ length: end - start }, (_, i) => start + i)
}

export default function PostsFeed() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sortField, setSortField] = useState('createdAt')
  const [direction, setDirection] = useState('desc')
  const [authorId, setAuthorId] = useState('')
  const [useCache, setUseCache] = useState(true)
  const [authors, setAuthors] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openPostId, setOpenPostId] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const latest = useRef(0)

  useEffect(() => {
    api.authors().then(({ data }) => setAuthors(data)).catch(() => {})
  }, [])

  useEffect(() => {
    const ticket = ++latest.current
    setLoading(true)
    api
      .posts({ page, size, sort: `${sortField},${direction}`, authorId, cached: useCache })
      .then(({ data }) => {
        if (ticket !== latest.current) return
        setResult(data)
        setError('')
      })
      .catch((e) => ticket === latest.current && setError(e.message))
      .finally(() => ticket === latest.current && setLoading(false))
  }, [page, size, sortField, direction, authorId, useCache, reloadKey])

  function chooseSort(option) {
    setSortField(option.field)
    setDirection(option.defaultDir)
    setPage(0)
  }

  function handlePublished() {
    setSortField('createdAt')
    setDirection('desc')
    setPage(0)
    setReloadKey((key) => key + 1)
  }

  const totalPages = result ? result.totalPages : 0
  const from = result && result.totalElements > 0 ? result.page * result.size + 1 : 0
  const to = result ? result.page * result.size + result.content.length : 0

  return (
    <section>
      <header className="view-head">
        <h1>Post feed</h1>
        <p>
          The feed asks the server for one page at a time. Change the page, size or sort order and watch the
          request tape: each call returns only what is on screen.
        </p>
      </header>

      <NewPostForm authors={authors} onPublished={handlePublished} />

      <div className="toolbar" role="group" aria-label="Feed options">
        <div className="segmented" role="group" aria-label="Sort by">
          {SORTS.map((option) => (
            <button
              key={option.field}
              className={sortField === option.field ? 'is-selected' : ''}
              aria-pressed={sortField === option.field}
              onClick={() => chooseSort(option)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          className="button"
          onClick={() => {
            setDirection(direction === 'desc' ? 'asc' : 'desc')
            setPage(0)
          }}
        >
          {direction === 'desc' ? 'High to low' : 'Low to high'}
        </button>

        <label className="field">
          <span>Author</span>
          <select
            value={authorId}
            onChange={(e) => {
              setAuthorId(e.target.value)
              setPage(0)
            }}
          >
            <option value="">Everyone</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Posts per page</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value))
              setPage(0)
            }}
          >
            {PAGE_SIZES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="check">
          <input type="checkbox" checked={useCache} onChange={(e) => setUseCache(e.target.checked)} />
          <span>Use the server cache</span>
        </label>
      </div>

      {error && (
        <div className="notice is-error" role="alert">
          {error}
        </div>
      )}

      {!result && loading && <p className="muted">Loading posts...</p>}

      {result && (
        <>
          <p className="range" aria-live="polite">
            {result.totalElements === 0
              ? 'No posts match these filters.'
              : `Showing ${number(from)} to ${number(to)} of ${number(result.totalElements)} posts`}
          </p>

          <ul className={`posts ${loading ? 'is-loading' : ''}`}>
            {result.content.map((post) => (
              <li key={post.id}>
                <button className="post" onClick={() => setOpenPostId(post.id)}>
                  <span className="post-likes">
                    <strong>{number(post.likes)}</strong>
                    <span>likes</span>
                  </span>
                  <span className="post-body">
                    <span className="post-title">{post.title}</span>
                    <span className="post-excerpt">{post.excerpt}</span>
                    <span className="post-meta">
                      <span>{post.authorName}</span>
                      <span>{number(post.views)} views</span>
                      <span>{date(post.createdAt)}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav className="pager" aria-label="Pages">
              <button className="button" disabled={result.first} onClick={() => setPage(0)}>
                First
              </button>
              <button className="button" disabled={result.first} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              {pageWindow(result.page, totalPages).map((p) => (
                <button
                  key={p}
                  className={`button page-number ${p === result.page ? 'is-selected' : ''}`}
                  aria-current={p === result.page ? 'page' : undefined}
                  onClick={() => setPage(p)}
                >
                  {p + 1}
                </button>
              ))}
              <button className="button" disabled={result.last} onClick={() => setPage(page + 1)}>
                Next
              </button>
              <button className="button" disabled={result.last} onClick={() => setPage(totalPages - 1)}>
                Last
              </button>
              <span className="pager-count">
                Page {result.page + 1} of {number(totalPages)}
              </span>
            </nav>
          )}
        </>
      )}

      {openPostId && <PostModal postId={openPostId} onClose={() => setOpenPostId(null)} />}
    </section>
  )
}
