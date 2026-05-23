/**
 * Admin credentials load from environment variables only.
 * Set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD in .env (gitignored).
 */

export function getAdminCredentials() {
  return {
    username: (import.meta.env.VITE_ADMIN_USERNAME || '').trim(),
    password: import.meta.env.VITE_ADMIN_PASSWORD || '',
  }
}

export function validateAdminLogin(username, password) {
  const expected = getAdminCredentials()
  if (!expected.username || !expected.password) {
    console.warn('Admin credentials missing. Set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD in .env')
    return false
  }
  return (
    username.trim() === expected.username &&
    password === expected.password
  )
}
