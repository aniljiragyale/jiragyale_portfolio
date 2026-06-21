import { requireAdmin } from './lib/adminToken.js'
import {
  isStorageConfigured,
  getStorageMode,
  getChats,
  addChat,
  setChats,
  deleteChat,
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
        'Connect Vercel KV: Dashboard → Storage → Create Database → KV (or Redis) → Connect to this project → Redeploy. Chat logs are stored in Excel automatically.',
    })
  }

  try {
    if (req.method === 'GET') {
      if (!requireAdmin(req, res)) return
      const chats = await getChats()
      return json(res, 200, { chats, storage: getStorageMode() })
    }

    if (req.method === 'POST') {
      const { userMessage, botResponse, id, date } = req.body || {}
      if (!userMessage?.trim() || !botResponse?.trim()) {
        return json(res, 400, { success: false, error: 'invalid_payload' })
      }
      const entry = {
        id: id || Date.now(),
        userMessage: String(userMessage).trim(),
        botResponse: String(botResponse).trim(),
        date: date || new Date().toLocaleString(),
      }
      await addChat(entry)
      return json(res, 201, { success: true, entry, storage: getStorageMode() })
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return
      const chats = Array.isArray(req.body) ? req.body : []
      await setChats(chats)
      return json(res, 200, { success: true, chats })
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return
      const clearAll = req.query?.all === '1'
      if (clearAll) {
        await setChats([])
        return json(res, 200, { success: true, chats: [] })
      }
      const id = Number(req.query?.id)
      if (!id) return json(res, 400, { success: false, error: 'missing_id' })
      const chats = await deleteChat(id)
      return json(res, 200, { success: true, chats })
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE')
    return json(res, 405, { success: false, error: 'method_not_allowed' })
  } catch (err) {
    console.error('chats API:', err)
    return json(res, 500, { success: false, error: 'server_error' })
  }
}
