import React, { useState } from 'react';

const CATEGORIES = ['Tech', 'Design', 'Product', 'Bug', 'Feature', 'Other'];

const CATEGORY_COLORS = {
  tech: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  design: { bg: 'rgba(236,72,153,0.15)', color: '#f472b6' },
  product: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  bug: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  feature: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
};
const getCategoryStyle = (cat = '') =>
  CATEGORY_COLORS[cat.toLowerCase()] || { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' };

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const timeAgo = (ts) => {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ViewPostModal = ({
  post, currentUser, handleVote, handleAddComment,
  handleDeletePost, handleEditPost, handleDeleteComment, onClose, updateModalPost
}) => {
  const hasVoted = post.votedBy?.includes(currentUser.id);
  const isAuthor = post.authorId === currentUser.id;
  const catStyle = getCategoryStyle(post.category);

  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: post.title,
    category: post.category,
    description: post.description
  });

  const submitComment = () => {
    if (!commentText.trim()) return;
    handleAddComment(post.id, commentText);
    setCommentText('');
  };

  const submitEdit = () => {
    if (!editForm.title.trim() || !editForm.category || !editForm.description.trim()) return;
    handleEditPost(post.id, editForm);
    setIsEditing(false);
  };

  const comments = post.comments || [];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content view-post-modal-content" style={{ maxWidth: '600px' }}>
        <button onClick={onClose} className="modal-close-button">✕</button>

        {/* ── View mode ── */}
        {!isEditing ? (
          <>
            <div className="view-post-meta" style={{ marginBottom: '0.5rem' }}>
              {post.category && (
                <span className="post-category-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
                  {post.category}
                </span>
              )}
              {post.createdAt && (
                <span className="view-post-author" style={{ marginLeft: 'auto', fontSize: '0.78rem' }}>
                  {timeAgo(post.createdAt)}
                </span>
              )}
            </div>

            <h2 className="view-post-title">{post.title}</h2>
            <p className="view-post-author" style={{ marginBottom: '1rem' }}>👤 {post.author}</p>
            <div className="view-post-description">{post.description}</div>

            {/* Voting */}
            <div className="view-post-vote-buttons" style={{ marginBottom: '1.25rem' }}>
              <button
                onClick={() => {
                  if (!hasVoted) {
                    handleVote(post.id, 'upvotes');
                    updateModalPost({ ...post, upvotes: post.upvotes + 1, votedBy: [...(post.votedBy || []), currentUser.id] });
                  }
                }}
                className="vote-button upvote" disabled={hasVoted}
              >
                <span className="vote-emoji">👍</span>
                <span className="vote-count">{post.upvotes}</span>
              </button>
              <button
                onClick={() => {
                  if (!hasVoted) {
                    handleVote(post.id, 'downvotes');
                    updateModalPost({ ...post, downvotes: post.downvotes + 1, votedBy: [...(post.votedBy || []), currentUser.id] });
                  }
                }}
                className="vote-button downvote" disabled={hasVoted}
              >
                <span className="vote-emoji">👎</span>
                <span className="vote-count">{post.downvotes}</span>
              </button>
              {hasVoted && <span className="voted-badge">✓ Already voted</span>}

              {/* Author actions */}
              {isAuthor && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button className="post-action-btn edit-btn" onClick={() => setIsEditing(true)}>
                    ✏️ Edit
                  </button>
                  <button className="post-action-btn delete-btn" onClick={() => handleDeletePost(post.id)}>
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>

            {/* ── Comments ── */}
            <div className="comments-section">
              <h4 className="comments-heading">
                💬 Comments <span className="comments-count">{comments.length}</span>
              </h4>

              {comments.length === 0 ? (
                <p className="comments-empty">No comments yet. Be the first!</p>
              ) : (
                <div className="comments-list">
                  {comments.map(c => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-avatar">{getInitials(c.author)}</div>
                      <div className="comment-body">
                        <div className="comment-meta">
                          <span className="comment-author">{c.author}</span>
                          <span className="comment-time">{timeAgo(c.createdAt)}</span>
                          {c.authorId === currentUser.id && (
                            <button
                              className="comment-delete-btn"
                              onClick={() => window.confirm('Delete this comment?') && handleDeleteComment(post.id, c.id)}
                              title="Delete comment"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment input */}
              <div className="comment-input-row">
                <div className="comment-avatar">{getInitials(`${currentUser.firstName} ${currentUser.lastName}`)}</div>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Add a comment…"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && submitComment()}
                />
                <button className="comment-submit-btn" onClick={submitComment} disabled={!commentText.trim()}>
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── Edit mode ── */
          <>
            <h2 className="modal-title">Edit Post</h2>
            <div className="modal-form-container">
              <div className="modal-input-row">
                <div className="modal-input-col">
                  <label className="modal-label">Title</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="modal-input-col">
                  <label className="modal-label">Category</label>
                  <select
                    className="modal-input"
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="">— Select —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="modal-label">Description</label>
                <textarea
                  className="modal-textarea"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button className="btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={submitEdit}>Save Changes</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewPostModal;