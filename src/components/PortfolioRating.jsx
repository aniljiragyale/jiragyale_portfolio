import { useState, useEffect } from 'react'
import { submitRating, fetchRatingsPublicStats } from '../utils/portfolioApi'

function StarButton({ value, filled, onClick, onHover }) {
  return (
    <button
      type="button"
      className={`rating-star ${filled ? 'filled' : ''}`}
      onClick={() => onClick(value)}
      onMouseEnter={() => onHover(value)}
      aria-label={`${value} star${value > 1 ? 's' : ''}`}
    >
      <i className={filled ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
    </button>
  )
}

export default function PortfolioRating() {
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState({ count: 0, average: 0 })

  const refreshStats = async () => {
    const next = await fetchRatingsPublicStats()
    setStats(next)
  }

  useEffect(() => {
    refreshStats()
  }, [])

  const displayStars = hover || selected

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selected < 1 || submitting) return

    setSubmitting(true)
    await submitRating({ stars: selected, name, comment })
    await refreshStats()
    setSubmitting(false)
    setSubmitted(true)
    setName('')
    setComment('')
    setSelected(0)
    setHover(0)
  }

  return (
    <section className="rating-section rv" id="rate-portfolio">
      <div className="rating-card">
        <div className="rating-card-glow" aria-hidden="true" />

        <div className="rating-header">
          <div>
            <div className="eyebrow">Your Feedback</div>
            <h2 className="rating-title">Rate This <span>Portfolio</span></h2>
            <p className="rating-sub">
              How was your experience? Your rating helps me improve — visible in my admin dashboard.
            </p>
          </div>

          {stats.count > 0 && (
            <div className="rating-summary-badge">
              <div className="rating-summary-score">{stats.average}</div>
              <div className="rating-summary-stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <i
                    key={n}
                    className={`fa-solid fa-star ${n <= Math.round(stats.average) ? 'on' : ''}`}
                  />
                ))}
              </div>
              <div className="rating-summary-count">{stats.count} rating{stats.count !== 1 ? 's' : ''}</div>
            </div>
          )}
        </div>

        {submitted ? (
          <div className="rating-success">
            <div className="rating-success-icon">✨</div>
            <h3>Thank you for your feedback!</h3>
            <p>Your rating has been saved successfully.</p>
            <button type="button" className="btn-ghost" onClick={() => setSubmitted(false)}>
              Submit another rating
            </button>
          </div>
        ) : (
          <form className="rating-form" onSubmit={handleSubmit}>
            <div className="rating-stars-row">
              <span className="rating-stars-label">Tap to rate</span>
              <div
                className="rating-stars"
                onMouseLeave={() => setHover(0)}
                role="group"
                aria-label="Star rating"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarButton
                    key={n}
                    value={n}
                    filled={n <= displayStars}
                    onClick={setSelected}
                    onHover={setHover}
                  />
                ))}
              </div>
              <span className="rating-stars-hint">
                {selected > 0 ? `${selected} / 5` : 'Select 1–5 stars'}
              </span>
            </div>

            <div className="rating-fields">
              <div>
                <label className="fl" htmlFor="rating-name">Your name (optional)</label>
                <input
                  id="rating-name"
                  type="text"
                  className="fi"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="fl" htmlFor="rating-comment">Short comment (optional)</label>
                <textarea
                  id="rating-comment"
                  className="ft rating-comment-input"
                  placeholder="What did you like about this portfolio?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <button type="submit" className="btn-grd rating-submit" disabled={selected < 1 || submitting}>
              {submitting ? 'Submitting…' : 'Submit Rating ✦'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
