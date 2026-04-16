import React, { useState, useEffect } from 'react';
import './App.css';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';

import CreateSuggestionModal from './components/modals/CreateSuggestionModal';
import ViewPostModal from './components/modals/ViewPostModal';
import UpdateUserModal from './components/modals/UpdateUserModal';
import ChangePasswordModal from './components/modals/ChangePasswordModal';

const VoiceBox = () => {
  // --- Lazy localStorage initialisers (prevents save-effect race on first render) ---
  const [users, setUsers] = useState(() => {
    try { const s = localStorage.getItem('voicebox_users'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [posts, setPosts] = useState(() => {
    try { const s = localStorage.getItem('voicebox_posts'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try { const s = localStorage.getItem('voicebox_current_user'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('voicebox_current_user'));
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('voicebox_current_user') ? 'home' : 'login');
  const [showModal, setShowModal] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Save-to-localStorage effects (safe now — initial values come from localStorage)
  useEffect(() => { localStorage.setItem('voicebox_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('voicebox_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('voicebox_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Form & UI state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [signupForm, setSignupForm] = useState({
    firstName: '', lastName: '', userType: '', email: '', password: ''
  });
  const [signupError, setSignupError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [newSuggestion, setNewSuggestion] = useState({ title: '', category: '', description: '' });
  const [suggestionError, setSuggestionError] = useState('');

  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');

  const [updateUserForm, setUpdateUserForm] = useState({
    firstName: '', lastName: '', userType: '', email: ''
  });
  const [updateUserError, setUpdateUserError] = useState('');

  const [sortBy, setSortBy] = useState('newest');
  const [myPostsOnly, setMyPostsOnly] = useState(false);


  // Auth handlers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = () => {
    const { firstName, lastName, userType, email, password } = signupForm;
    if (!firstName.trim() || !lastName.trim()) {
      setSignupError('Please enter your first and last name.'); return;
    }
    if (!userType) {
      setSignupError('Please select a user type.'); return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setSignupError('Please enter a valid email address.'); return;
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setSignupError('An account with this email already exists.'); return;
    }
    if (!password || password.length < 6) {
      setSignupError('Password must be at least 6 characters.'); return;
    }
    const newUser = { id: Date.now(), ...signupForm };
    setUsers([...users, newUser]);
    setSignupForm({ firstName: '', lastName: '', userType: '', email: '', password: '' });
    setSignupError('');
    alert('🎉 Account created successfully! Please sign in.');
    setCurrentPage('login');
  };

  const handleLogin = () => {
    const { email, password } = loginForm;
    if (!email.trim()) {
      setLoginError('Please enter your email address.'); return;
    }
    if (!isValidEmail(email)) {
      setLoginError('Please enter a valid email address.'); return;
    }
    if (!password) {
      setLoginError('Please enter your password.'); return;
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentPage('home');
      setLoginForm({ email: '', password: '' });
      setLoginError('');
    } else {
      // Give a hint whether the email itself exists
      const emailExists = users.some(u => u.email === email);
      setLoginError(emailExists
        ? 'Incorrect password. Please try again.'
        : 'No account found with that email address.'
      );
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage('login');
    localStorage.removeItem('voicebox_current_user');
    setShowSidebar(false);
  };

  // Post handlers
  const handleCreateSuggestion = () => {
    if (!newSuggestion.title || !newSuggestion.category || !newSuggestion.description) {
      setSuggestionError('Please fill in all fields.'); return;
    }
    const newPost = {
      id: Date.now(),
      ...newSuggestion,
      authorId: currentUser.id,
      author: `${currentUser.firstName} ${currentUser.lastName}`,
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      comments: [],
      createdAt: Date.now()
    };
    setPosts([newPost, ...posts]);
    setNewSuggestion({ title: '', category: '', description: '' });
    setSuggestionError('');
    setShowModal(null);
  };

  const handleVote = (postId, voteType) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasVoted = post.votedBy?.includes(currentUser.id);
        if (hasVoted) return post;
        return { ...post, [voteType]: post[voteType] + 1, votedBy: [...(post.votedBy || []), currentUser.id] };
      }
      return post;
    }));
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    const comment = {
      id: Date.now(),
      authorId: currentUser.id,
      author: `${currentUser.firstName} ${currentUser.lastName}`,
      text: commentText.trim(),
      createdAt: Date.now()
    };
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...(post.comments || []), comment] }
        : post
    ));
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setPosts(posts.filter(post => post.id !== postId));
    setShowModal(null);
  };

  const handleEditPost = (postId, updatedData) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, ...updatedData } : post
    ));
    setShowModal(prev =>
      prev?.type === 'viewPost'
        ? { type: 'viewPost', post: { ...prev.post, ...updatedData } }
        : prev
    );
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: post.comments.filter(c => c.id !== commentId) }
        : post
    ));
    setShowModal(prev =>
      prev?.type === 'viewPost' && prev.post.id === postId
        ? { type: 'viewPost', post: { ...prev.post, comments: prev.post.comments.filter(c => c.id !== commentId) } }
        : prev
    );
  };

  const handleUpdateUserInfo = () => {
    if (!updateUserForm.firstName || !updateUserForm.lastName || !updateUserForm.userType || !updateUserForm.email) {
      setUpdateUserError('Please fill in all fields.'); return;
    }
    const updatedUser = { ...currentUser, ...updateUserForm };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setUpdateUserError('');
    setShowModal(null);
  };

  const handleChangePassword = () => {
    if (!passwordForm.password || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in both fields.'); return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.'); return;
    }
    const updatedUser = { ...currentUser, password: passwordForm.password };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setPasswordForm({ password: '', confirmPassword: '' });
    setPasswordError('');
    setShowModal(null);
  };

  const openUpdateUserModal = () => {
    setUpdateUserForm({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      userType: currentUser.userType,
      email: currentUser.email
    });
    setUpdateUserError('');
    setShowModal('updateUser');
  };

  // Derive unique categories from posts
  const allCategories = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const sortFn = (a, b) => {
    if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
    if (sortBy === 'comments') return (b.comments?.length || 0) - (a.comments?.length || 0);
    return 0;
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesMine = !myPostsOnly || post.authorId === currentUser?.id;
      return matchesSearch && matchesCategory && matchesMine;
    })
    .sort(sortFn);

  const latestPost = posts[0];

  // Auth pages
  if (currentPage === 'login' && !isLoggedIn) {
    return (
      <LoginPage
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        setCurrentPage={setCurrentPage}
        errorMsg={loginError}
      />
    );
  }

  if (currentPage === 'signup' && !isLoggedIn) {
    return (
      <SignupPage
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        handleSignup={handleSignup}
        setCurrentPage={setCurrentPage}
        errorMsg={signupError}
      />
    );
  }

  return (
    <div className="main-container">
      <Header
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onNewPost={() => { setSuggestionError(''); setShowModal('createSuggestion'); }}
      />

      <div className="main-flex">
        <div className={`main-content${showSidebar ? ' sidebar-open' : ''}`}>
          {/* Latest Activity */}
          <div className="latest-activity-section">
            <div className="section-header">
              <h2 className="section-title">Latest Activity</h2>
              <button
                onClick={() => { setSuggestionError(''); setShowModal('createSuggestion'); }}
                className="create-suggestion-button"
              >
                ✦ Create Suggestion
              </button>
            </div>

            {latestPost ? (
              <div className="latest-post" onClick={() => setShowModal({ type: 'viewPost', post: latestPost })} style={{ cursor: 'pointer' }}>
                <div className="latest-post-badge">🔥 Latest</div>
                <h3 className="latest-post-title">{latestPost.title}</h3>
                <p className="latest-post-author">By {latestPost.author}</p>
                <p className="latest-post-description">{latestPost.description}</p>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <p className="empty-state-text">No activity yet — be the first to post!</p>
                <button
                  onClick={() => { setSuggestionError(''); setShowModal('createSuggestion'); }}
                  className="create-suggestion-button"
                >
                  ✦ Create Suggestion
                </button>
              </div>
            )}
          </div>

          {/* All Posts */}
          <div className="all-posts-section">
            {/* Header row */}
            <div className="all-posts-header">
              <h2 className="all-posts-title">
                {myPostsOnly ? '👤 My Posts' : 'All Posts'}
              </h2>
              <div className="posts-toolbar">
                {/* My Posts toggle */}
                <button
                  className={`my-posts-toggle ${myPostsOnly ? 'active' : ''}`}
                  onClick={() => setMyPostsOnly(p => !p)}
                >
                  {myPostsOnly ? '✦ My Posts' : 'My Posts'}
                </button>

                {/* Sort dropdown */}
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">🕐 Newest</option>
                  <option value="upvotes">👍 Most Upvoted</option>
                  <option value="comments">💬 Most Commented</option>
                </select>

                {/* Search */}
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search posts…"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            {allCategories.length > 1 && (
              <div className="category-filter-row">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="posts-list">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setShowModal({ type: 'viewPost', post })}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p className="empty-state-text">No posts found. Try a different search or category.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showSidebar && (
          <Sidebar
            currentUser={currentUser}
            setShowModal={setShowModal}
            handleLogout={handleLogout}
            openUpdateUserModal={openUpdateUserModal}
          />
        )}
      </div>

      {/* Modals */}
      {showModal === 'createSuggestion' && (
        <CreateSuggestionModal
          newSuggestion={newSuggestion}
          setNewSuggestion={setNewSuggestion}
          handleCreateSuggestion={handleCreateSuggestion}
          onClose={() => setShowModal(null)}
          errorMsg={suggestionError}
        />
      )}

      {showModal?.type === 'viewPost' && (
        <ViewPostModal
          post={showModal.post}
          currentUser={currentUser}
          handleVote={handleVote}
          handleAddComment={handleAddComment}
          handleDeletePost={handleDeletePost}
          handleEditPost={handleEditPost}
          handleDeleteComment={handleDeleteComment}
          onClose={() => setShowModal(null)}
          updateModalPost={(updatedPost) => setShowModal({ type: 'viewPost', post: updatedPost })}
        />
      )}

      {showModal === 'updateUser' && (
        <UpdateUserModal
          updateUserForm={updateUserForm}
          setUpdateUserForm={setUpdateUserForm}
          handleUpdateUserInfo={handleUpdateUserInfo}
          onClose={() => setShowModal(null)}
          errorMsg={updateUserError}
        />
      )}

      {showModal === 'changePassword' && (
        <ChangePasswordModal
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          handleChangePassword={handleChangePassword}
          onClose={() => setShowModal(null)}
          errorMsg={passwordError}
        />
      )}
    </div>
  );
};

export default VoiceBox;