import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLoginForm from '../components/AdminLoginForm'
import {
  getMessages,
  saveMessages,
  getRatings,
  deleteRating,
  clearAllRatings,
  getRatingStats,
} from '../utils/portfolioStorage'

function StarDisplay({ count }) {
  return (
    <span className="admin-rating-stars" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={`fa-solid fa-star ${n <= count ? 'on' : ''}`} />
      ))}
    </span>
  )
}

export default function Admin() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const [tab, setTab] = useState('messages')
  const [messages, setMessages] = useState([])
  const [ratings, setRatings] = useState([])
  const [ratingStats, setRatingStats] = useState({ count: 0, average: 0, distribution: {} })

  const loadAll = () => {
    setMessages(getMessages())
    setRatings(getRatings())
    setRatingStats(getRatingStats())
  }

  useEffect(() => {
    const authStatus =
      sessionStorage.getItem('admin_authorized') || localStorage.getItem('admin_authorized')
    const authUser = sessionStorage.getItem('admin_user') || localStorage.getItem('admin_user')
    if (authStatus === 'true' && authUser) {
      setIsAuthorized(true)
      setAdminUser(authUser)
      loadAll()
    }
  }, [])

  const handleLogout = () => {
    setIsAuthorized(false)
    setAdminUser('')
    sessionStorage.removeItem('admin_authorized')
    sessionStorage.removeItem('admin_user')
    localStorage.removeItem('admin_authorized')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_session')
  }

  const handleDeleteMessage = (id) => {
    const updated = messages.filter((m) => m.id !== id)
    setMessages(updated)
    saveMessages(updated)
  }

  const handleClearMessages = () => {
    if (window.confirm('Delete all contact messages?')) {
      setMessages([])
      saveMessages([])
    }
  }

  const handleDeleteRating = (id) => {
    const updated = deleteRating(id)
    setRatings(updated)
    setRatingStats(getRatingStats())
  }

  const handleClearRatings = () => {
    if (window.confirm('Delete all portfolio ratings?')) {
      clearAllRatings()
      setRatings([])
      setRatingStats(getRatingStats())
    }
  }

  if (!isAuthorized) {
    return (
      <div className="admin-login-page">
        <AdminLoginForm
          onSuccess={(user) => {
            setIsAuthorized(true)
            setAdminUser(user)
            loadAll()
          }}
        />
      </div>
    )
  }

  const dist = ratingStats.distribution || {}

  return (
    <div className="sec-wrap admin-dashboard-wrap">
      <div className="container page-hero-wrap admin-container">
        <div className="admin-toolbar">
          <div>
            <div className="eyebrow">Control Center</div>
            <h1 className="sec-title admin-title">Admin <span>Dashboard</span></h1>
            <p className="admin-welcome">Signed in as <strong>{adminUser}</strong></p>
          </div>
          <div className="admin-toolbar-actions">
            <Link to="/" className="btn-ghost admin-btn-sm">← Website</Link>
            <button type="button" onClick={handleLogout} className="btn-grd admin-btn-sm">
              Logout
            </button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-n">{messages.length}</div>
            <div className="admin-stat-l">Contact Messages</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-n gold">{ratingStats.average || '—'}</div>
            <div className="admin-stat-l">Avg. Portfolio Rating</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-n accent2">{ratingStats.count}</div>
            <div className="admin-stat-l">Total Ratings</div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${tab === 'messages' ? 'active' : ''}`}
            onClick={() => setTab('messages')}
          >
            <i className="fas fa-envelope" /> Messages ({messages.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${tab === 'ratings' ? 'active' : ''}`}
            onClick={() => setTab('ratings')}
          >
            <i className="fas fa-star" /> Ratings ({ratings.length})
          </button>
        </div>

        {tab === 'messages' && (
          <>
            {messages.length > 0 && (
              <div className="admin-panel-actions">
                <button type="button" onClick={handleClearMessages} className="btn-ghost admin-btn-sm admin-btn-danger">
                  Clear all messages
                </button>
              </div>
            )}
            {messages.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">📬</div>
                <h3>No messages yet</h3>
                <p>Contact form submissions will appear here.</p>
              </div>
            ) : (
              <div className="admin-msg-list">
                {messages.map((msg) => (
                  <article key={msg.id} className="admin-msg-card">
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="admin-msg-delete"
                      title="Delete message"
                      aria-label="Delete message"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                    <div className="admin-msg-meta">
                      <div>
                        <span className="admin-msg-label">Sender</span>
                        <strong className="admin-msg-val">{msg.name}</strong>
                      </div>
                      <div>
                        <span className="admin-msg-label">Email</span>
                        <a href={`mailto:${msg.email}`} className="admin-msg-link">{msg.email}</a>
                      </div>
                      <div>
                        <span className="admin-msg-label">Date</span>
                        <span className="admin-msg-date">{msg.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className="admin-msg-label">Subject</span>
                      <div className="admin-msg-subject">{msg.subject || '—'}</div>
                      <span className="admin-msg-label">Message</span>
                      <p className="admin-msg-body">{msg.message}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'ratings' && (
          <>
            {ratings.length > 0 && (
              <div className="admin-rating-overview rv">
                <div className="admin-rating-big">
                  <span className="admin-rating-big-num">{ratingStats.average}</span>
                  <StarDisplay count={Math.round(ratingStats.average)} />
                  <span className="admin-rating-big-sub">{ratingStats.count} total ratings</span>
                </div>
                <div className="admin-rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = dist[star] || 0
                    const pct = ratingStats.count ? (count / ratingStats.count) * 100 : 0
                    return (
                      <div key={star} className="admin-rating-bar-row">
                        <span className="admin-rating-bar-label">{star} ★</span>
                        <div className="admin-rating-bar-track">
                          <div className="admin-rating-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="admin-rating-bar-count">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {ratings.length > 0 && (
              <div className="admin-panel-actions">
                <button type="button" onClick={handleClearRatings} className="btn-ghost admin-btn-sm admin-btn-danger">
                  Clear all ratings
                </button>
              </div>
            )}

            {ratings.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">⭐</div>
                <h3>No ratings yet</h3>
                <p>Visitor ratings from the home page will appear here.</p>
                <Link to="/#rate-portfolio" className="btn-ghost" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  View rating section →
                </Link>
              </div>
            ) : (
              <div className="admin-msg-list">
                {ratings.map((r) => (
                  <article key={r.id} className="admin-msg-card admin-rating-card">
                    <button
                      type="button"
                      onClick={() => handleDeleteRating(r.id)}
                      className="admin-msg-delete"
                      title="Delete rating"
                      aria-label="Delete rating"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                    <div className="admin-rating-card-head">
                      <StarDisplay count={r.stars} />
                      <span className="admin-rating-card-score">{r.stars}/5</span>
                    </div>
                    <div className="admin-msg-meta" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                      <div>
                        <span className="admin-msg-label">From</span>
                        <strong className="admin-msg-val">{r.name}</strong>
                      </div>
                      <div>
                        <span className="admin-msg-label">Date</span>
                        <span className="admin-msg-date">{r.date}</span>
                      </div>
                    </div>
                    {r.comment && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className="admin-msg-label">Comment</span>
                        <p className="admin-msg-body">{r.comment}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
