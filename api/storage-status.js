import { isStorageConfigured, getStorageMode } from './lib/portfolioStore.js'

/** Public health check — confirms KV/Excel is wired (no secrets exposed). */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const configured = isStorageConfigured()
  return res.status(configured ? 200 : 503).json({
    ok: configured,
    storage: getStorageMode(),
    message: configured
      ? 'Excel storage ready — form and rating submissions will be saved.'
      : 'Add KV_REST_API_URL and KV_REST_API_TOKEN in Vercel env vars, then redeploy.',
  })
}
