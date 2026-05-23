import { useState } from 'react'
import { Link } from 'react-router-dom'
import { areAdminCredentialsConfigured, validateAdminLogin } from '../config/adminAuth'

function setAdminSession(user) {
  const payload = { at: Date.now(), user }
  sessionStorage.setItem('admin_authorized', 'true')
  sessionStorage.setItem('admin_user', user)
  try {
    localStorage.setItem('admin_authorized', 'true')
    localStorage.setItem('admin_user', user)
    localStorage.setItem('admin_session', JSON.stringify(payload))
  } catch {
    /* private mode / storage full */
  }
}

export default function AdminLoginForm({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const credentialsReady = areAdminCredentialsConfigured()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!credentialsReady) {
      setError('Admin login is not configured on this server. Add VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD, then redeploy.')
      return
    }

    if (!username.trim() || !password) {
      setError('Please enter username and password.')
      return
    }

    if (validateAdminLogin(username, password)) {
      setAdminSession(username.trim())
      setPassword('')
      onSuccess(username.trim())
    } else {
      setError('Invalid username or password.')
      setPassword('')
    }
  }

  return (
    <div className="admin-login-card rv on">
      <div className="admin-login-head">
        <div className="admin-login-icon">🔐</div>
        <h1 className="admin-login-title">Admin <span>Login</span></h1>
        <p className="admin-login-sub">Sign in to view contact messages &amp; portfolio ratings</p>
      </div>

      <div className="admin-login-steps">
        <div className="admin-login-step">
          <span className="admin-login-step-n">1</span>
          <span>Enter your <strong>username</strong> and <strong>password</strong></span>
        </div>
        <div className="admin-login-step">
          <span className="admin-login-step-n">2</span>
          <span>Click <strong>Sign In</strong> to open the dashboard</span>
        </div>
        <div className="admin-login-step">
          <span className="admin-login-step-n">3</span>
          <span>Manage inquiries &amp; visitor ratings</span>
        </div>
      </div>

      {!credentialsReady && (
        <div className="form-msg error show admin-config-notice">
          Admin credentials are missing in this build. For local dev, set them in <code>.env</code>. For your live site, add the same variables in Vercel/hosting settings and redeploy.
        </div>
      )}

      <form onSubmit={handleLogin} className="admin-login-form">
        <div>
          <label className="fl" htmlFor="admin-username">Username</label>
          <input
            type="text"
            id="admin-username"
            className="fi admin-fi"
            placeholder="Your admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            required
          />
        </div>
        <div>
          <label className="fl" htmlFor="admin-password">Password</label>
          <input
            type="password"
            id="admin-password"
            className="fi admin-fi"
            placeholder="Your admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            enterKeyHint="go"
            required
          />
        </div>

        {error && <div className="form-msg error show">{error}</div>}

        <button type="submit" className="fsub admin-signin-btn" disabled={!credentialsReady}>
          Sign In to Admin Panel ✦
        </button>
      </form>

      <div className="admin-login-footer">
        <Link to="/">← Back to Website</Link>
      </div>
    </div>
  )
}
