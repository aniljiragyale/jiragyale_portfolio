import { resolveAdminCredentials } from '../shared/adminCredentials.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method_not_allowed' })
  }

  const { username, password } = req.body || {}
  const expected = resolveAdminCredentials(process.env)

  if (
    String(username || '').trim() === expected.username &&
    String(password || '') === expected.password
  ) {
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ success: false, error: 'invalid_credentials' })
}
