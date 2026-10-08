import { useState } from 'react'
import { api } from '../api.js'

export default function NewPostForm({ authors, onPublished }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      await api.createPost({ title, content, authorId: authorId ? Number(authorId) : null })
      setTitle('')
      setContent('')
      setMessage({ kind: 'ok', text: 'Post published. The server cleared its cached pages, so the feed below is fresh.' })
      onPublished()
    } catch (e) {
      setMessage({ kind: 'error', text: e.message })
    } finally {
      setBusy(false)
    }
  }

  if (!open) {
    return (
      <div className="compose-closed">
        <button className="button" onClick={() => setOpen(true)}>
          Write a post
        </button>
        {message && <span className={`inline-note ${message.kind === 'error' ? 'is-error' : ''}`}>{message.text}</span>}
      </div>
    )
  }

  return (
    <form className="compose" onSubmit={submit}>
      <h2>Write a post</h2>
      <p className="muted">Publishing clears the server cache, which is how cached pages stay correct after a change.</p>
      <label className="field wide">
        <span>Title</span>
        <input value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="field wide">
        <span>Content</span>
        <textarea value={content} maxLength={2000} rows={4} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <label className="field">
        <span>Author</span>
        <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} required>
          <option value="">Choose an author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </label>
      <div className="compose-actions">
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? 'Publishing...' : 'Publish post'}
        </button>
        <button className="button" type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      {message && (
        <p className={`inline-note ${message.kind === 'error' ? 'is-error' : ''}`} role="status">
          {message.text}
        </p>
      )}
    </form>
  )
}
