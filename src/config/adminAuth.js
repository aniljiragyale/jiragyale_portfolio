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

/** @returns {Promise<{ ok: boolean, reason?: 'invalid'|'error' }>} */
export async function loginAdmin(username, password) {
  const trimmedUser = username.trim()

  if (import.meta.env.PROD) {
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUser, password }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) return { ok: true }
      if (res.status === 401) return { ok: false, reason: 'invalid' }
    } catch {
      /* API unavailable — validate in browser below */
    }
  }

  if (validateAdminLogin(trimmedUser, password)) return { ok: true }
  return { ok: false, reason: 'invalid' }
}
