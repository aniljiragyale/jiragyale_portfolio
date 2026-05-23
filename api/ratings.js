import { requireAdmin, verifyAdminToken } from './lib/adminToken.js'
import {
  isKvConfigured,
  getRatings,
  addRating,
  setRatings,
  deleteRating,
  computeRatingStats,
} from './lib/portfolioStore.js'

function json(res, status, body) {
  res.status(status).json(body)
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (!isKvConfigured()) {
    return json(res, 503, {
      success: false,
      error: 'storage_not_configured',
      message:
        'Connect Vercel KV: Project → Storage → Create Database → KV → Connect, then redeploy.',
    })
  }

  try {
    if (req.method === 'GET') {
      const header = req.headers.authorization || ''
      const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
      const isAdmin = verifyAdminToken(token)
      const ratings = await getRatings()
      const stats = computeRatingStats(ratings)
      if (isAdmin) {
        return json(res, 200, { ratings, stats })
      }
      return json(res, 200, { stats, public: true })
    }

    if (req.method === 'POST') {
      const { stars, name, comment, id, date } = req.body || {}
      const starNum = Math.min(5, Math.max(1, Math.round(Number(stars))))
      if (!starNum) return json(res, 400, { success: false, error: 'invalid_stars' })

      const entry = {
        id: id || Date.now(),
        stars: starNum,
        name: String(name || '').trim() || 'Anonymous',
        comment: String(comment || '').trim(),
        date: date || new Date().toLocaleString(),
      }
      await addRating(entry)
      const ratings = await getRatings()
      return json(res, 201, {
        success: true,
        entry,
        stats: computeRatingStats(ratings),
      })
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return
      const ratings = Array.isArray(req.body) ? req.body : []
      await setRatings(ratings)
      return json(res, 200, { success: true, ratings, stats: computeRatingStats(ratings) })
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return
      const clearAll = req.query?.all === '1'
      if (clearAll) {
        await setRatings([])
        return json(res, 200, { success: true, ratings: [], stats: computeRatingStats([]) })
      }
      const id = Number(req.query?.id)
      if (!id) return json(res, 400, { success: false, error: 'missing_id' })
      const ratings = await deleteRating(id)
      return json(res, 200, { success: true, ratings, stats: computeRatingStats(ratings) })
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE')
    return json(res, 405, { success: false, error: 'method_not_allowed' })
  } catch (err) {
    console.error('ratings API:', err)
    return json(res, 500, { success: false, error: 'server_error' })
  }
}
