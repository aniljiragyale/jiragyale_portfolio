import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import AdminLoginForm from '../components/AdminLoginForm'
import AdminSiteContent from '../components/admin/AdminSiteContent'
import {
  fetchMessagesAdmin,
  deleteMessageAdmin,
  clearMessagesAdmin,
  fetchRatingsAdmin,
  deleteRatingAdmin,
  clearRatingsAdmin,
  clearAdminApiToken,
  downloadExcelExport,
  fetchChatsAdmin,
  deleteChatAdmin,
  clearChatsAdmin,
} from '../utils/portfolioApi'

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
  const [chats, setChats] = useState([])
  const [ratingStats, setRatingStats] = useState({ count: 0, average: 0, distribution: {} })
  const [loading, setLoading] = useState(false)
  const [storageOk, setStorageOk] = useState(true)
  const [storageMode, setStorageMode] = useState('')
  const [excelDownloading, setExcelDownloading] = useState(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    const msgResult = await fetchMessagesAdmin()
    if (msgResult?.error === 'unauthorized') {
      setIsAuthorized(false)
      setLoading(false)
      return
    }
    setMessages(msgResult.messages || [])
    setStorageOk(msgResult.storageOk !== false)
    if (msgResult.storageMode) setStorageMode(msgResult.storageMode)

    const ratingResult = await fetchRatingsAdmin()
    setRatings(ratingResult.ratings || [])
    setRatingStats(ratingResult.stats || { count: 0, average: 0, distribution: {} })
    if (ratingResult.storageOk === false) setStorageOk(false)
    if (ratingResult.storageMode) setStorageMode(ratingResult.storageMode)

    const chatResult = await fetchChatsAdmin()
    setChats(chatResult.chats || [])
    if (chatResult.storageOk === false) setStorageOk(false)
    if (chatResult.storageMode) setStorageMode(chatResult.storageMode)
    setLoading(false)
  }, [])

  const handleDownloadExcel = async () => {
    setExcelDownloading(true)
    try {
      await downloadExcelExport()
    } catch {
      window.alert('Could not download Excel. Check that you are logged in and cloud storage is connected.')
    } finally {
      setExcelDownloading(false)
    }
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
  }, [loadAll])

  const handleLogout = () => {
    setIsAuthorized(false)
    setAdminUser('')
    sessionStorage.removeItem('admin_authorized')
    sessionStorage.removeItem('admin_user')
    localStorage.removeItem('admin_authorized')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_session')
    clearAdminApiToken()
  }

  const handleDeleteMessage = async (id) => {
    const updated = await deleteMessageAdmin(id)
    setMessages(updated)
  }

  const handleClearMessages = async () => {
    if (window.confirm('Delete all contact messages?')) {
      const updated = await clearMessagesAdmin()
      setMessages(updated)
    }
  }

  const handleDeleteRating = async (id) => {
    const { ratings: updated, stats } = await deleteRatingAdmin(id)
    setRatings(updated)
    setRatingStats(stats)
  }

  const handleClearRatings = async () => {
    if (window.confirm('Delete all portfolio ratings?')) {
      const { ratings: updated, stats } = await clearRatingsAdmin()
      setRatings(updated)
      setRatingStats(stats)
    }
  }

  const handleDeleteChat = async (id) => {
    const updated = await deleteChatAdmin(id)
    setChats(updated)
  }

  const handleClearChats = async () => {
    if (window.confirm('Delete all chat logs?')) {
      const updated = await clearChatsAdmin()
      setChats(updated)
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
            <button type="button" onClick={loadAll} className="btn-ghost admin-btn-sm" disabled={loading}>
              {loading ? 'Refreshing…' : '↻ Refresh'}
            </button>
            <button
              type="button"
              onClick={handleDownloadExcel}
              className="btn-ghost admin-btn-sm"
              disabled={excelDownloading}
              title="Download all messages and ratings as Excel"
            >
              {excelDownloading ? '…' : '📥 Excel'}
            </button>
            <Link to="/" className="btn-ghost admin-btn-sm">← Website</Link>
            <button type="button" onClick={handleLogout} className="btn-grd admin-btn-sm">
              Logout
            </button>
          </div>
        </div>

        {storageOk && storageMode === 'excel' && (
          <div className="form-msg success show admin-storage-notice">
            <strong>Excel storage active.</strong> Every contact form and rating is saved to{' '}
            <code>portfolio-submissions.xlsx</code> in the cloud. Use <strong>📥 Excel</strong> to open it in Microsoft Excel.
          </div>
        )}

        {!storageOk && (
          <div className="form-msg error show admin-config-notice admin-storage-notice">
            <strong>Excel cloud storage not connected.</strong> On Vercel open your project → <strong>Storage</strong> →{' '}
            <strong>Create Database</strong> → choose <strong>KV</strong> (or Upstash Redis) → <strong>Connect</strong> →{' '}
            <strong>Redeploy</strong>. Then every form and rating saves to Excel and appears here. Until then, only this browser’s local data is shown.
          </div>
        )}

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
          <div className="admin-stat-card">
            <div className="admin-stat-n" style={{ color: 'var(--purple)' }}>{chats.length}</div>
            <div className="admin-stat-l">Chat Logs</div>
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
          <button
            type="button"
            className={`admin-tab ${tab === 'chats' ? 'active' : ''}`}
            onClick={() => setTab('chats')}
          >
            <i className="fas fa-comments" /> Chats ({chats.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${tab === 'content' ? 'active' : ''}`}
            onClick={() => setTab('content')}
          >
            <i className="fas fa-pen" /> Edit Site
          </button>
        </div>

        {loading && (
          <p className="admin-loading-hint">Loading submissions from server…</p>
        )}

        {tab === 'content' && <AdminSiteContent />}

        {tab === 'messages' && (
          <>
            {messages.length > 0 && (
              <div className="admin-panel-actions">
                <button type="button" onClick={handleClearMessages} className="btn-ghost admin-btn-sm admin-btn-danger">
                  Clear all messages
                </button>
              </div>
            )}
            {messages.length === 0 && !loading ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">📬</div>
                <h3>No messages yet</h3>
                <p>Contact form submissions from your live site will appear here.</p>
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

            {ratings.length === 0 && !loading ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">⭐</div>
                <h3>No ratings yet</h3>
                <p>Visitor ratings from your live site will appear here.</p>
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

        {tab === 'chats' && (
          <>
            {chats.length > 0 && (
              <div className="admin-panel-actions">
                <button type="button" onClick={handleClearChats} className="btn-ghost admin-btn-sm admin-btn-danger">
                  Clear all chats
                </button>
              </div>
            )}
            {chats.length === 0 && !loading ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">💬</div>
                <h3>No chats yet</h3>
                <p>Chatbot conversations with your visitors will appear here.</p>
              </div>
            ) : (
              <div className="admin-msg-list">
                {chats.map((c) => (
                  <article key={c.id} className="admin-msg-card">
                    <button
                      type="button"
                      onClick={() => handleDeleteChat(c.id)}
                      className="admin-msg-delete"
                      title="Delete chat log"
                      aria-label="Delete chat log"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                    <div className="admin-msg-meta">
                      <div>
                        <span className="admin-msg-label">Chat Session ID</span>
                        <strong className="admin-msg-val">#{c.id}</strong>
                      </div>
                      <div>
                        <span className="admin-msg-label">Date</span>
                        <span className="admin-msg-date">{c.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className="admin-msg-label">User Query</span>
                      <div className="admin-msg-subject" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 'normal', color: 'var(--text)' }}>
                        {c.userMessage}
                      </div>
                      <span className="admin-msg-label" style={{ marginTop: '0.75rem' }}>AJ Assistant Response</span>
                      <p className="admin-msg-body" style={{ borderLeft: '3px solid var(--accent)', background: 'rgba(99,179,237,0.05)' }}>
                        {c.botResponse}
                      </p>
                    </div>
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
