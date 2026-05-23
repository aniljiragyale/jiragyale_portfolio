/**
 * Default admin login (used when .env / Vercel env vars are not set).
 * Change these if you want a different username/password on the live site.
 * Optional override: set ADMIN_USERNAME / ADMIN_PASSWORD (or VITE_*) in Vercel or .env
 */
export const FALLBACK_ADMIN_USERNAME = 'aniljiragyale'
export const FALLBACK_ADMIN_PASSWORD = 'Anil@9591'

export function resolveAdminCredentials(env = {}) {
  const username = (
    env.ADMIN_USERNAME ||
    env.VITE_ADMIN_USERNAME ||
    FALLBACK_ADMIN_USERNAME
  ).trim()
  const password =
    env.ADMIN_PASSWORD ||
    env.VITE_ADMIN_PASSWORD ||
    FALLBACK_ADMIN_PASSWORD
  return { username, password }
}
