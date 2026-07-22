import { PLATFORMS } from '../../constants/platforms.js';
import './DraftItem.css';

function formatTimestamp(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function DraftItem({ draft, isPending, onEdit, onDelete }) {
  const preview = draft.text.length > 120 ? `${draft.text.slice(0, 120)}…` : draft.text;

  return (
    <li className="draft-item">
      <div className="draft-item__main">
        <p className="draft-item__title">{draft.title}</p>
        <p className="draft-item__preview">{preview || 'Empty draft'}</p>
        <div className="draft-item__meta">
          <span className="draft-item__timestamp">Updated {formatTimestamp(draft.updatedAt)}</span>
          <div className="draft-item__platforms">
            {draft.platformIds.map((id) => (
              <span
                key={id}
                className="draft-item__platform-dot"
                style={{ '--platform-accent': PLATFORMS[id]?.accent }}
                title={PLATFORMS[id]?.label}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="draft-item__actions">
        <button type="button" className="draft-item__btn" onClick={() => onEdit(draft)} disabled={isPending}>
          Edit
        </button>
        <button
          type="button"
          className="draft-item__btn draft-item__btn--danger"
          onClick={() => onDelete(draft.id)}
          disabled={isPending}
        >
          {isPending ? 'Working…' : 'Delete'}
        </button>
      </div>
    </li>
  );
}
