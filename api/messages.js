import { requireAdmin } from './lib/adminToken.js'
import {
  isStorageConfigured,
  getStorageMode,
  getMessages,
  addMessage,
  setMessages,
  deleteMessage,
} from './lib/portfolioStore.js'

function json(res, status, body) {
  res.status(status).json(body)
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (!isStorageConfigured()) {
    return json(res, 503, {
      success: false,
      error: 'storage_not_configured',
      message:
        'Connect Vercel KV: Dashboard → Storage → Create Database → KV (or Redis) → Connect to this project → Redeploy. Submissions are stored in Excel automatically.',
    })
  }

  try {
    if (req.method === 'GET') {
      if (!requireAdmin(req, res)) return
      const messages = await getMessages()
      return json(res, 200, { messages, storage: getStorageMode() })
    }

    if (req.method === 'POST') {
      const { name, email, subject, message, id, date } = req.body || {}
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return json(res, 400, { success: false, error: 'invalid_payload' })
      }
      const entry = {
        id: id || Date.now(),
        name: String(name).trim(),
        email: String(email).trim(),
        subject: String(subject || '').trim(),
        message: String(message).trim(),
        date: date || new Date().toLocaleString(),
      }
      await addMessage(entry)
      return json(res, 201, { success: true, entry, storage: getStorageMode() })
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return
      const messages = Array.isArray(req.body) ? req.body : []
      await setMessages(messages)
      return json(res, 200, { success: true, messages })
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return
      const clearAll = req.query?.all === '1'
      if (clearAll) {
        await setMessages([])
        return json(res, 200, { success: true, messages: [] })
      }
      const id = Number(req.query?.id)
      if (!id) return json(res, 400, { success: false, error: 'missing_id' })
      const messages = await deleteMessage(id)
      return json(res, 200, { success: true, messages })
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE')
    return json(res, 405, { success: false, error: 'method_not_allowed' })
  } catch (err) {
    console.error('messages API:', err)
    return json(res, 500, { success: false, error: 'server_error' })
  }
}
