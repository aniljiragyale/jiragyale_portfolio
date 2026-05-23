import crypto from 'node:crypto'
import { resolveAdminCredentials } from '../../shared/adminCredentials.js'

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getSecret() {
  return (
    process.env.ADMIN_TOKEN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.VITE_ADMIN_PASSWORD ||
    resolveAdminCredentials(process.env).password
  )
}

export function createAdminToken(username) {
  const exp = Date.now() + TOKEN_TTL_MS
  const payload = `${String(username).trim()}:${exp}`
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export function verifyAdminToken(token) {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const lastColon = decoded.lastIndexOf(':')
    if (lastColon === -1) return false
    const sig = decoded.slice(lastColon + 1)
    const payload = decoded.slice(0, lastColon)
    const secondColon = payload.lastIndexOf(':')
    if (secondColon === -1) return false
    const username = payload.slice(0, secondColon)
    const exp = Number(payload.slice(secondColon + 1))
    if (!username || !exp || Date.now() > exp) return false
    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(`${username}:${exp}`)
      .digest('hex')
    return sig === expected
  } catch {
    return false
  }
}

export function requireAdmin(req, res) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!verifyAdminToken(token)) {
    res.status(401).json({ success: false, error: 'unauthorized' })
    return false
  }
  return true
}
