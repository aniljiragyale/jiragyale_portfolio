const MESSAGES_KEY = 'portfolio_messages'
const RATINGS_KEY = 'portfolio_ratings'

export function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveMessages(messages) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

export function getRatings() {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveRatings(ratings) {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
}

export function addRating({ stars, name = '', comment = '' }) {
  const ratings = getRatings()
  const entry = {
    id: Date.now(),
    stars: Math.min(5, Math.max(1, Math.round(stars))),
    name: name.trim() || 'Anonymous',
    comment: comment.trim(),
    date: new Date().toLocaleString(),
  }
  saveRatings([entry, ...ratings])
  return entry
}

export function deleteRating(id) {
  const updated = getRatings().filter((r) => r.id !== id)
  saveRatings(updated)
  return updated
}

export function clearAllRatings() {
  localStorage.removeItem(RATINGS_KEY)
}

export function getRatingStats() {
  const ratings = getRatings()
  if (ratings.length === 0) {
    return { count: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  }
  const sum = ratings.reduce((acc, r) => acc + r.stars, 0)
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratings.forEach((r) => {
    distribution[r.stars] = (distribution[r.stars] || 0) + 1
  })
  return {
    count: ratings.length,
    average: Math.round((sum / ratings.length) * 10) / 10,
    distribution,
  }
}
