import React from 'react';

const Header = ({ showSidebar, setShowSidebar, onNewPost }) => {
  return (
    <header className="header">
      <h1 className="header-title">VoiceBox</h1>

      <div className="header-actions">
        <button className="header-new-post-btn" onClick={onNewPost}>
          ✦ New Post
        </button>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className={`header-toggle-button ${showSidebar ? 'hamburger-open' : ''}`}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>
    </header>
  );
};

export default Header;