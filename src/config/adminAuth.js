import { resolveAdminCredentials } from '../../shared/adminCredentials.js'

/**
 * Credentials: .env (local) → Vercel env vars → shared/adminCredentials.js defaults
 */

export function getAdminCredentials() {
  return resolveAdminCredentials(import.meta.env)
}

export function areAdminCredentialsConfigured() {
  const { username, password } = getAdminCredentials()
  return Boolean(username && password)
}

export function validateAdminLogin(username, password) {
  const expected = getAdminCredentials()
  return (
    username.trim() === expected.username &&
    password === expected.password
  )
}

/** @returns {Promise<{ ok: boolean, token?: string, reason?: 'invalid'|'error' }>} */
export async function loginAdmin(username, password) {
  const trimmedUser = username.trim()

  try {
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: trimmedUser, password }),
    })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data.success) {
      return { ok: true, token: data.token }
    }
    if (res.status === 401) return { ok: false, reason: 'invalid' }
  } catch {
    /* API unavailable — fall back to local validation (dev only) */
  }

  if (validateAdminLogin(trimmedUser, password)) {
    return { ok: true, token: null }
  }
  return { ok: false, reason: 'invalid' }
}
