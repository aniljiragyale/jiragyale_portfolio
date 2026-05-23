import { useState } from 'react'
import { Link } from 'react-router-dom'
import { validateAdminLogin } from '../config/adminAuth'

export default function AdminLoginForm({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Please enter username and password.')
      return
    }

    if (validateAdminLogin(username, password)) {
      sessionStorage.setItem('admin_authorized', 'true')
      sessionStorage.setItem('admin_user', username.trim())
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

      <form onSubmit={handleLogin} className="admin-login-form">
        <div>
          <label className="fl" htmlFor="admin-username">Username</label>
          <input
            type="text"
            id="admin-username"
            className="fi"
            placeholder="Your admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="fl" htmlFor="admin-password">Password</label>
          <input
            type="password"
            id="admin-password"
            className="fi"
            placeholder="Your admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <div className="form-msg error show">{error}</div>}

        <button type="submit" className="fsub">Sign In to Admin Panel ✦</button>
      </form>

      <div className="admin-login-footer">
        <Link to="/">← Back to Website</Link>
      </div>
    </div>
  )
}
