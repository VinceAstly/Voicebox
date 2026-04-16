import React from 'react';

const CATEGORY_COLORS = {
  tech: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  design: { bg: 'rgba(236,72,153,0.15)', color: '#f472b6' },
  product: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  bug: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  feature: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
};

const getCategoryStyle = (category = '') => {
  const key = category.toLowerCase();
  return CATEGORY_COLORS[key] || { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' };
};

const getInitials = (name = '') => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const PostCard = ({ post, onClick }) => {
  const catStyle = getCategoryStyle(post.category);

  return (
    <div className="post-card" onClick={onClick}>
      <div className="post-card-header">
        <div className="post-card-content">
          <div className="post-card-meta">
            {post.category && (
              <span
                className="post-category-badge"
                style={{ background: catStyle.bg, color: catStyle.color }}
              >
                {post.category}
              </span>
            )}
            <span className="post-card-author">
              <span
                className="post-card-avatar"
                style={{ display: 'inline-flex', marginRight: '0.25rem' }}
              >
                {getInitials(post.author)}
              </span>
              {post.author}
            </span>
          </div>

          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-description">{post.description}</p>
        </div>

        <div className="post-card-votes">
          <div className="post-card-vote-item">
            <span className="post-card-vote-emoji">👍</span>
            <span className="post-card-vote-count">{post.upvotes}</span>
          </div>
          <div className="post-card-vote-item">
            <span className="post-card-vote-emoji">👎</span>
            <span className="post-card-vote-count">{post.downvotes}</span>
          </div>
          <div className="post-card-vote-item">
            <span className="post-card-vote-emoji">💬</span>
            <span className="post-card-vote-count">{(post.comments || []).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;