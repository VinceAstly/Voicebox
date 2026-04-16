import React from 'react';

const USER_TYPES = ['Student', 'Teacher', 'Staff', 'Admin', 'Guest'];

const UpdateUserModal = ({ updateUserForm, setUpdateUserForm, handleUpdateUserInfo, onClose, errorMsg }) => {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content update-user-modal-content">
        <button onClick={onClose} className="modal-close-button">✕</button>
        <h2 className="modal-title">Update Profile</h2>

        <div className="modal-form-container">
          <div className="modal-form-group">
            <label className="modal-label">First Name</label>
            <input
              type="text"
              className="modal-input"
              value={updateUserForm.firstName}
              onChange={(e) => setUpdateUserForm({ ...updateUserForm, firstName: e.target.value })}
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Last Name</label>
            <input
              type="text"
              className="modal-input"
              value={updateUserForm.lastName}
              onChange={(e) => setUpdateUserForm({ ...updateUserForm, lastName: e.target.value })}
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-label">User Type</label>
            <select
              className="modal-input"
              value={updateUserForm.userType}
              onChange={(e) => setUpdateUserForm({ ...updateUserForm, userType: e.target.value })}
            >
              <option value="">— Select a type —</option>
              {USER_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Email</label>
            <input
              type="email"
              className="modal-input"
              value={updateUserForm.email}
              onChange={(e) => setUpdateUserForm({ ...updateUserForm, email: e.target.value })}
            />
          </div>

          {errorMsg && (
            <div className="inline-error">⚠️ {errorMsg}</div>
          )}

          <div className="modal-form-buttons">
            <button onClick={handleUpdateUserInfo} className="modal-form-button modal-form-button-primary">
              Save Changes
            </button>
            <button onClick={onClose} className="modal-form-button modal-form-button-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;