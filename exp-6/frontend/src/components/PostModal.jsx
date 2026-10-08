import { useEffect, useRef, useState } from 'react'
import { api } from '../api.js'
import { date, number } from '../format.js'

export default function PostModal({ postId, onClose }) {
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const closeRef = useRef(null)

  useEffect(() => {
    api
      .post(postId)
      .then(({ data }) => setPost(data))
      .catch((e) => setError(e.message))
  }, [postId])

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Post details" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="button modal-close" onClick={onClose}>
          Close
        </button>
        {error && <p className="notice is-error">{error}</p>}
        {!post && !error && <p className="muted">Loading post...</p>}
        {post && (
          <>
            <h2>{post.title}</h2>
            <p className="post-meta">
              <span>{post.authorName}</span>
              <span>{number(post.likes)} likes</span>
              <span>{number(post.views)} views</span>
              <span>{date(post.createdAt)}</span>
            </p>
            <p className="modal-content">{post.content}</p>
            <h3>
              {post.comments.length === 0
                ? 'No comments yet'
                : `${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}`}
            </h3>
            <ul className="comments">
              {post.comments.map((comment) => (
                <li key={comment.id}>
                  <strong>{comment.commenter}</strong>
                  <span className="muted"> on {date(comment.createdAt)}</span>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
