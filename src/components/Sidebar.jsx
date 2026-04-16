import React from 'react';

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
};

const Sidebar = ({ currentUser, setShowModal, handleLogout, openUpdateUserModal }) => {
  const initials = getInitials(currentUser.firstName, currentUser.lastName);

  return (
    <div className="sidebar">
      {/* User Info */}
      <div className="sidebar-user-section">
        <div className="sidebar-avatar">{initials}</div>
        <div className="sidebar-user-text">
          <div className="sidebar-user-name">
            {currentUser.firstName} {currentUser.lastName}
          </div>
          <div className="sidebar-user-info">{currentUser.email}</div>
          <span className="sidebar-badge">{currentUser.userType}</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu-buttons">
        <div className="sidebar-section-label">Settings</div>
        <button className="sidebar-menu-button">
          <span className="sidebar-menu-icon">🚩</span> Report a Problem
        </button>
        <button className="sidebar-menu-button">
          <span className="sidebar-menu-icon">📄</span> Terms and Policies
        </button>
        <button className="sidebar-menu-button">
          <span className="sidebar-menu-icon">🌐</span> Language
        </button>
        <button className="sidebar-menu-button">
          <span className="sidebar-menu-icon">🎨</span> Theme
        </button>
        <button className="sidebar-menu-button">
          <span className="sidebar-menu-icon">🔔</span> Notifications
        </button>
      </div>

      {/* Account Actions */}
      <div className="sidebar-action-buttons">
        <button
          onClick={() => setShowModal('changePassword')}
          className="sidebar-action-button"
        >
          🔒 Change Password
        </button>
        <button
          onClick={openUpdateUserModal}
          className="sidebar-action-button"
        >
          ✏️ Update Profile
        </button>
        <button onClick={handleLogout} className="btn-danger">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;