import { requireAdmin } from './lib/adminToken.js'
import { getExcelDownloadBuffer } from './lib/excelStore.js'
import { buildExportBuffer } from './lib/portfolioStore.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ success: false, error: 'method_not_allowed' })
  }

  if (!requireAdmin(req, res)) return

  try {
    let buffer = await getExcelDownloadBuffer()
    if (!buffer) {
      buffer = Buffer.from(await buildExportBuffer())
    }

    const filename = `portfolio-submissions-${new Date().toISOString().slice(0, 10)}.xlsx`
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.status(200).send(buffer)
  } catch (err) {
    console.error('export-excel:', err)
    return res.status(500).json({ success: false, error: 'export_failed' })
  }
}
