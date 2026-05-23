/**
 * Vercel serverless login — credentials stay on the server (not in the JS bundle).
 * Set ADMIN_USERNAME and ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.
 */
function getExpectedCredentials() {
  const username = (
    process.env.ADMIN_USERNAME ||
    process.env.VITE_ADMIN_USERNAME ||
    ''
  ).trim()
  const password =
    process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || ''
  return { username, password }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method_not_allowed' })
  }

  const { username, password } = req.body || {}
  const expected = getExpectedCredentials()

  if (!expected.username || !expected.password) {
    return res.status(503).json({
      success: false,
      error: 'not_configured',
      message:
        'Add ADMIN_USERNAME and ADMIN_PASSWORD in your hosting environment variables, then redeploy.',
    })
  }

  if (
    String(username || '').trim() === expected.username &&
    String(password || '') === expected.password
  ) {
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ success: false, error: 'invalid_credentials' })
}
