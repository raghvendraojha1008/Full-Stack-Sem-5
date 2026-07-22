import { useState, useMemo, useEffect } from 'react';
import { PLATFORMS } from '../../constants/platforms.js';
import { validateAll } from '../../patterns/validationStrategies.js';
import { useCharacterLimit } from '../../hooks/useCharacterLimit.js';
import PlatformSelector from '../PlatformSelector/PlatformSelector.jsx';
import CharacterMeter from '../CharacterMeter/CharacterMeter.jsx';
import './PostComposer.css';

const EMPTY_DRAFT = {
  id: null,
  title: '',
  text: '',
  media: [],
  platformIds: []
};

export default function PostComposer({ activeDraft, onSave, onPublish, onCancelEdit, isSaving }) {
  const [form, setForm] = useState(EMPTY_DRAFT);
  const [mediaCountInput, setMediaCountInput] = useState(0);
  const [touched, setTouched] = useState(false);

  // Controlled sync: when the parent hands us a draft to edit, load it in.
  useEffect(() => {
    if (activeDraft) {
      setForm({
        id: activeDraft.id,
        title: activeDraft.title,
        text: activeDraft.text,
        media: activeDraft.media ?? [],
        platformIds: activeDraft.platformIds ?? []
      });
      setMediaCountInput((activeDraft.media ?? []).length);
      setTouched(false);
    } else {
      setForm(EMPTY_DRAFT);
      setMediaCountInput(0);
      setTouched(false);
    }
  }, [activeDraft]);

  const selectedPlatformConfigs = useMemo(
    () => form.platformIds.map((id) => PLATFORMS[id]).filter(Boolean),
    [form.platformIds]
  );

  const charLimitInfo = useCharacterLimit(form.text, selectedPlatformConfigs);

  const contentForValidation = useMemo(
    () => ({ text: form.text, media: Array.from({ length: mediaCountInput }) }),
    [form.text, mediaCountInput]
  );

  const issuesByPlatform = useMemo(
    () => validateAll(contentForValidation, selectedPlatformConfigs),
    [contentForValidation, selectedPlatformConfigs]
  );

  const allIssues = useMemo(
    () => Object.values(issuesByPlatform).flat(),
    [issuesByPlatform]
  );

  const hasBlockingErrors = allIssues.some((issue) => issue.severity === 'error');
  const canSubmit =
    form.text.trim().length > 0 && form.platformIds.length > 0 && !hasBlockingErrors;

  const handleTextChange = (event) => {
    setForm((prev) => ({ ...prev, text: event.target.value }));
    setTouched(true);
  };

  const handleTitleChange = (event) => {
    setForm((prev) => ({ ...prev, title: event.target.value }));
  };

  const handlePlatformChange = (platformIds) => {
    setForm((prev) => ({ ...prev, platformIds }));
    setTouched(true);
  };

  const handleMediaChange = (event) => {
    const value = Math.max(0, Number(event.target.value) || 0);
    setMediaCountInput(value);
    setForm((prev) => ({ ...prev, media: Array.from({ length: value }, (_, i) => `media-${i}`) }));
  };

  const handleSave = async () => {
    setTouched(true);
    if (!canSubmit) return;
    const title = form.title.trim() || form.text.slice(0, 40) || 'Untitled draft';
    await onSave({ ...form, title });
  };

  const handlePublish = async () => {
    setTouched(true);
    if (!canSubmit) return;
    const title = form.title.trim() || form.text.slice(0, 40) || 'Untitled draft';
    await onPublish({ ...form, title });
  };

  return (
    <section className="composer" aria-labelledby="composer-heading">
      <div className="composer__header">
        <div>
          <p className="composer__eyebrow">Dispatch Desk</p>
          <h1 id="composer-heading" className="composer__heading">
            {activeDraft ? 'Edit draft' : 'Compose a post'}
          </h1>
        </div>
        {activeDraft && (
          <button type="button" className="composer__cancel" onClick={onCancelEdit}>
            Start a new post
          </button>
        )}
      </div>

      <label className="composer__field">
        <span className="composer__field-label">Internal title (optional)</span>
        <input
          type="text"
          className="composer__title-input"
          placeholder="e.g. Product launch teaser"
          value={form.title}
          onChange={handleTitleChange}
        />
      </label>

      <label className="composer__field">
        <span className="composer__field-label">Post content</span>
        <textarea
          className="composer__textarea"
          placeholder="What do you want to send out?"
          value={form.text}
          onChange={handleTextChange}
          rows={7}
        />
      </label>

      <div className="composer__meter-row">
        <CharacterMeter
          length={form.text.length}
          limit={charLimitInfo.limit}
          status={charLimitInfo.status}
          tightestPlatform={charLimitInfo.tightestPlatform}
        />
        <label className="composer__media-field">
          <span className="composer__field-label">Attached media</span>
          <input
            type="number"
            min="0"
            max="10"
            className="composer__media-input"
            value={mediaCountInput}
            onChange={handleMediaChange}
          />
        </label>
      </div>

      <div className="composer__field">
        <span className="composer__field-label">Send to</span>
        <PlatformSelector
          selectedIds={form.platformIds}
          onChange={handlePlatformChange}
          issuesByPlatform={issuesByPlatform}
        />
      </div>

      {touched && allIssues.length > 0 && (
        <ul className="composer__issues">
          {allIssues.map((issue, index) => (
            <li key={index} className={`composer__issue composer__issue--${issue.severity}`}>
              {issue.message}
            </li>
          ))}
        </ul>
      )}

      {touched && form.platformIds.length === 0 && (
        <p className="composer__hint">Select at least one platform to validate and send this post.</p>
      )}

      <div className="composer__actions">
        <button
          type="button"
          className="composer__btn composer__btn--ghost"
          onClick={handleSave}
          disabled={!canSubmit || isSaving}
        >
          {isSaving ? 'Saving…' : activeDraft ? 'Update draft' : 'Save as draft'}
        </button>
        <button
          type="button"
          className="composer__btn composer__btn--primary"
          onClick={handlePublish}
          disabled={!canSubmit || isSaving}
        >
          {isSaving ? 'Working…' : 'Publish now'}
        </button>
      </div>
    </section>
  );
}
