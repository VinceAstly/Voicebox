import React, { useState } from 'react';

const getStrength = (pw) => {
  if (!pw) return null;
  if (pw.length < 6) return 'weak';
  if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return 'medium';
  return 'strong';
};

const ChangePasswordModal = ({ passwordForm, setPasswordForm, handleChangePassword, onClose, errorMsg }) => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const strength = getStrength(passwordForm.password);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content update-user-modal-content">
        <button onClick={onClose} className="modal-close-button">✕</button>
        <h2 className="modal-title">Change Password</h2>

        <div className="modal-form-container">
          <div className="modal-form-group">
            <label className="modal-label">New Password</label>
            <div className="input-password-wrapper">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter new password"
                className="modal-input"
                style={{ paddingRight: '3rem' }}
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {strength && (
              <div className="password-strength">
                <div className="strength-bar-track">
                  <div className={`strength-bar-fill ${strength}`} />
                </div>
                <span className={`strength-label ${strength}`}>
                  {strength === 'weak' ? '⚠️ Weak' : strength === 'medium' ? '⚡ Medium' : '✅ Strong'}
                </span>
              </div>
            )}
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Confirm Password</label>
            <div className="input-password-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-type new password"
                className="modal-input"
                style={{ paddingRight: '3rem' }}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="inline-error">⚠️ {errorMsg}</div>
          )}

          <div className="modal-form-buttons">
            <button onClick={handleChangePassword} className="modal-form-button modal-form-button-primary">
              Confirm
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

export default ChangePasswordModal;