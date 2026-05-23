/**
 * Local dev: VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD in .env
 * Production (Vercel): POST /api/admin-login uses ADMIN_USERNAME / ADMIN_PASSWORD on the server
 */

export function getAdminCredentials() {
  return {
    username: (import.meta.env.VITE_ADMIN_USERNAME || '').trim(),
    password: import.meta.env.VITE_ADMIN_PASSWORD || '',
  }
}

export function areAdminCredentialsConfigured() {
  if (import.meta.env.PROD) return true
  const { username, password } = getAdminCredentials()
  return Boolean(username && password)
}

export function validateAdminLogin(username, password) {
  const expected = getAdminCredentials()
  if (!expected.username || !expected.password) {
    return false
  }
  return (
    username.trim() === expected.username &&
    password === expected.password
  )
}

/** @returns {Promise<{ ok: boolean, reason?: 'invalid'|'not_configured'|'error' }>} */
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
      if (res.status === 503 || data.error === 'not_configured') {
        return { ok: false, reason: 'not_configured' }
      }
      if (res.status === 401) return { ok: false, reason: 'invalid' }
      return { ok: false, reason: 'error' }
    } catch {
      return { ok: false, reason: 'error' }
    }
  }

  if (!areAdminCredentialsConfigured()) {
    return { ok: false, reason: 'not_configured' }
  }
  if (validateAdminLogin(trimmedUser, password)) return { ok: true }
  return { ok: false, reason: 'invalid' }
}
