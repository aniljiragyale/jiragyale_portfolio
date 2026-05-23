/**
 * Cloud storage for messages & ratings (Vercel KV).
 * Falls back to localStorage when API/KV is unavailable (local dev).
 */

const MESSAGES_KEY = 'portfolio_messages'
const RATINGS_KEY = 'portfolio_ratings'
const ADMIN_TOKEN_KEY = 'admin_api_token'

function authHeaders() {
  const token =
    sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function writeLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function setAdminApiToken(token) {
  if (!token) return
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
  } catch {
    /* ignore */
  }
}

export function clearAdminApiToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

function mergeById(remote, local) {
  const map = new Map()
  ;[...local, ...remote].forEach((item) => map.set(item.id, item))
  return [...map.values()].sort((a, b) => (b.id || 0) - (a.id || 0))
}

// ——— Messages ———

export async function submitMessage(payload) {
  const entry = {
    id: Date.now(),
    ...payload,
    date: new Date().toLocaleString(),
  }

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    if (res.ok) return { ok: true, entry, cloud: true }
  } catch (err) {
    console.warn('submitMessage API:', err)
  }

  const local = [entry, ...readLocal(MESSAGES_KEY)]
  writeLocal(MESSAGES_KEY, local)
  return { ok: true, entry, cloud: false }
}

export async function fetchMessagesAdmin() {
  try {
    const res = await fetch('/api/messages', { headers: authHeaders() })
    if (res.ok) {
      const remote = await res.json()
      if (import.meta.env.DEV) {
        return mergeById(remote, readLocal(MESSAGES_KEY))
      }
      return remote
    }
    if (res.status === 401) {
      return { error: 'unauthorized' }
    }
    if (res.status === 503) {
      return { error: 'storage_not_configured', data: readLocal(MESSAGES_KEY) }
    }
  } catch (err) {
    console.warn('fetchMessagesAdmin:', err)
  }
  return readLocal(MESSAGES_KEY)
}

export async function saveMessagesAdmin(messages) {
  try {
    const res = await fetch('/api/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(messages),
    })
    if (res.ok) {
      writeLocal(MESSAGES_KEY, messages)
      return messages
    }
  } catch (err) {
    console.warn('saveMessagesAdmin:', err)
  }
  writeLocal(MESSAGES_KEY, messages)
  return messages
}

export async function deleteMessageAdmin(id) {
  try {
    const res = await fetch(`/api/messages?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (res.ok) {
      const data = await res.json()
      writeLocal(MESSAGES_KEY, data.messages || [])
      return data.messages
    }
  } catch (err) {
    console.warn('deleteMessageAdmin:', err)
  }
  const updated = readLocal(MESSAGES_KEY).filter((m) => m.id !== id)
  writeLocal(MESSAGES_KEY, updated)
  return updated
}

export async function clearMessagesAdmin() {
  try {
    const res = await fetch('/api/messages?all=1', {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (res.ok) {
      writeLocal(MESSAGES_KEY, [])
      return []
    }
  } catch (err) {
    console.warn('clearMessagesAdmin:', err)
  }
  writeLocal(MESSAGES_KEY, [])
  return []
}

// ——— Ratings ———

export async function submitRating({ stars, name = '', comment = '' }) {
  const entry = {
    id: Date.now(),
    stars: Math.min(5, Math.max(1, Math.round(stars))),
    name: String(name).trim() || 'Anonymous',
    comment: String(comment).trim(),
    date: new Date().toLocaleString(),
  }

  try {
    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      return { ok: true, entry, stats: data.stats, cloud: true }
    }
  } catch (err) {
    console.warn('submitRating API:', err)
  }

  const local = [entry, ...readLocal(RATINGS_KEY)]
  writeLocal(RATINGS_KEY, local)
  return { ok: true, entry, stats: computeStatsLocal(local), cloud: false }
}

export async function fetchRatingsPublicStats() {
  try {
    const res = await fetch('/api/ratings')
    if (res.ok) {
      const data = await res.json()
      if (data.stats) return data.stats
    }
  } catch (err) {
    console.warn('fetchRatingsPublicStats:', err)
  }
  return computeStatsLocal(readLocal(RATINGS_KEY))
}

export async function fetchRatingsAdmin() {
  try {
    const res = await fetch('/api/ratings', { headers: authHeaders() })
    if (res.ok) {
      const data = await res.json()
      const ratings = data.ratings || []
      if (import.meta.env.DEV) {
        const merged = mergeById(ratings, readLocal(RATINGS_KEY))
        return {
          ratings: merged,
          stats: computeStatsLocal(merged),
          storageOk: true,
        }
      }
      return {
        ratings,
        stats: data.stats || computeStatsLocal(ratings),
        storageOk: true,
      }
    }
    if (res.status === 503) {
      const local = readLocal(RATINGS_KEY)
      return {
        ratings: local,
        stats: computeStatsLocal(local),
        storageOk: false,
      }
    }
  } catch (err) {
    console.warn('fetchRatingsAdmin:', err)
  }
  const local = readLocal(RATINGS_KEY)
  return { ratings: local, stats: computeStatsLocal(local), storageOk: false }
}

export async function deleteRatingAdmin(id) {
  try {
    const res = await fetch(`/api/ratings?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (res.ok) {
      const data = await res.json()
      writeLocal(RATINGS_KEY, data.ratings || [])
      return { ratings: data.ratings, stats: data.stats }
    }
  } catch (err) {
    console.warn('deleteRatingAdmin:', err)
  }
  const updated = readLocal(RATINGS_KEY).filter((r) => r.id !== id)
  writeLocal(RATINGS_KEY, updated)
  return { ratings: updated, stats: computeStatsLocal(updated) }
}

export async function clearRatingsAdmin() {
  try {
    const res = await fetch('/api/ratings?all=1', {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (res.ok) {
      writeLocal(RATINGS_KEY, [])
      return { ratings: [], stats: computeStatsLocal([]) }
    }
  } catch (err) {
    console.warn('clearRatingsAdmin:', err)
  }
  writeLocal(RATINGS_KEY, [])
  return { ratings: [], stats: computeStatsLocal([]) }
}

function computeStatsLocal(ratings) {
  if (!ratings.length) {
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
