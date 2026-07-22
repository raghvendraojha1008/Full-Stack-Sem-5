import DraftItem from '../DraftItem/DraftItem.jsx';
import './DraftList.css';

export default function DraftList({ drafts, isLoading, pendingIds, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="draft-list__status">
        <span className="draft-list__pulse" aria-hidden="true" />
        Loading drafts from storage…
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="draft-list__status draft-list__status--empty">
        No drafts yet. Write something above and save it to build your queue.
      </div>
    );
  }

  return (
    <ul className="draft-list">
      {drafts.map((draft) => (
        <DraftItem
          key={draft.id}
          draft={draft}
          isPending={pendingIds.has(draft.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
