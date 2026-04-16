import React, { useState } from 'react';

const LoginPage = ({ loginForm, setLoginForm, handleLogin, setCurrentPage, errorMsg }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      {/* Left brand panel */}
      <div className="login-brand-panel">
        <div className="brand-logo-mark">🎙️</div>
        <h1 className="brand-title">VoiceBox</h1>
        <p className="brand-subtitle">Share your ideas.<br />Shape the future.</p>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <div className="login-box">
          <h2 className="login-heading">Welcome back</h2>
          <p className="login-subheading">Sign in to continue to VoiceBox</p>

          <div className="login-form-wrapper">
            <div className="input-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="form-input"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="input-group">
              <label className="form-label">Password</label>
              <div className="input-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="form-input"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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

            <button onClick={handleLogin} className="btn-primary" style={{ marginTop: '0.5rem' }}>
              Sign In
            </button>
          </div>

          <p className="login-footer">
            Don't have an account?{' '}
            <button onClick={() => setCurrentPage('signup')} className="link-button">
              Create one!
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;