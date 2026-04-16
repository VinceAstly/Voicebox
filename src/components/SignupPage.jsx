import React, { useState } from 'react';

const USER_TYPES = ['Student', 'Teacher', 'Staff', 'Admin', 'Guest'];

const SignupPage = ({ signupForm, setSignupForm, handleSignup, setCurrentPage, errorMsg }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signup-container">
      <div className="signup-box">
        <button onClick={() => setCurrentPage('login')} className="signup-back-button">
          ← Back to Login
        </button>

        <h2 className="signup-heading">Create Account</h2>
        <p className="signup-subheading">Join VoiceBox and share your ideas</p>

        <div className="signup-form-wrapper">
          <div className="signup-input-row">
            <div className="input-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                placeholder="Jane"
                className="form-input"
                value={signupForm.firstName}
                onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="form-input"
                value={signupForm.lastName}
                onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="form-label">User Type</label>
            <select
              className="form-input"
              value={signupForm.userType}
              onChange={(e) => setSignupForm({ ...signupForm, userType: e.target.value })}
            >
              <option value="">— Select a type —</option>
              {USER_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="form-input"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="form-label">Password</label>
            <div className="input-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className="form-input"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="inline-error">⚠️ {errorMsg}</div>
          )}

          <div className="signup-button-container">
            <button onClick={handleSignup} className="btn-primary">
              Create Account
            </button>
            <button onClick={() => setCurrentPage('login')} className="btn-ghost">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;