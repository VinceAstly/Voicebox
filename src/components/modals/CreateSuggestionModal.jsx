import React from 'react';

const CATEGORIES = ['Tech', 'Design', 'Product', 'Bug', 'Feature', 'Other'];

const CreateSuggestionModal = ({ newSuggestion, setNewSuggestion, handleCreateSuggestion, onClose, errorMsg }) => {
  const descLength = newSuggestion.description.length;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content create-suggestion-modal-content">
        <button onClick={onClose} className="modal-close-button">✕</button>
        <h2 className="modal-title">New Suggestion</h2>

        <div className="modal-form-container">
          <div className="modal-input-row">
            <div className="modal-input-col">
              <label className="modal-label">Title</label>
              <input
                type="text"
                placeholder="What's your idea?"
                className="modal-input"
                value={newSuggestion.title}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
              />
            </div>
            <div className="modal-input-col">
              <label className="modal-label">Category</label>
              <select
                className="modal-input"
                value={newSuggestion.category}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, category: e.target.value })}
              >
                <option value="">— Select a category —</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="modal-label">Description</label>
            <textarea
              placeholder="Describe your suggestion in detail…"
              className="modal-textarea"
              value={newSuggestion.description}
              onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
              maxLength={1000}
            />
            <div className={`char-counter ${descLength > 850 ? 'warn' : ''}`}>
              {descLength} / 1000
            </div>
          </div>

          {errorMsg && (
            <div className="inline-error">⚠️ {errorMsg}</div>
          )}

          <div className="modal-actions">
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={handleCreateSuggestion} className="btn-primary">
              ✦ Create Suggestion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSuggestionModal;