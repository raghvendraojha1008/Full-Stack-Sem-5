import { useState, useCallback } from 'react';
import PostComposer from './components/PostComposer/PostComposer.jsx';
import DraftList from './components/DraftList/DraftList.jsx';
import Toast from './components/Toast/Toast.jsx';
import { useDrafts } from './hooks/useDrafts.js';
import './App.css';

export default function App() {
  const { drafts, isLoading, error, pendingIds, saveDraft, deleteDraft, publishDraft } = useDrafts();
  const [activeDraft, setActiveDraft] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: Date.now() });
  }, []);

  const handleSave = async (draftInput) => {
    setIsSaving(true);
    try {
      const saved = await saveDraft(draftInput);
      setActiveDraft(null);
      showToast(`Draft "${saved.title}" saved.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (draftInput) => {
    setIsSaving(true);
    try {
      const saved = await saveDraft(draftInput);
      await publishDraft(saved);
      setActiveDraft(null);
      showToast(`Published to ${saved.platformIds.length} platform(s).`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (draftId) => {
    try {
      await deleteDraft(draftId);
      showToast('Draft deleted.', 'info');
      if (activeDraft?.id === draftId) setActiveDraft(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="app">
      <header className="app__masthead">
        <div className="app__masthead-inner">
          <span className="app__logo-mark" aria-hidden="true" />
          <div>
            <p className="app__masthead-title">Dispatch Desk</p>
            <p className="app__masthead-subtitle">Post composer &amp; draft manager</p>
          </div>
        </div>
      </header>

      <main className="app__grid">
        <PostComposer
          activeDraft={activeDraft}
          onSave={handleSave}
          onPublish={handlePublish}
          onCancelEdit={() => setActiveDraft(null)}
          isSaving={isSaving}
        />

        <section className="app__drafts" aria-labelledby="drafts-heading">
          <div className="app__drafts-header">
            <h2 id="drafts-heading" className="app__drafts-heading">
              Draft queue
            </h2>
            <span className="app__drafts-count">{drafts.length}</span>
          </div>
          {error && !isLoading && (
            <p className="app__error">Couldn&apos;t reach storage: {error}</p>
          )}
          <DraftList
            drafts={drafts}
            isLoading={isLoading}
            pendingIds={pendingIds}
            onEdit={setActiveDraft}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
