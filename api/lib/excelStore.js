import ExcelJS from 'exceljs'
import { list, put } from '@vercel/blob'
import { kv } from '@vercel/kv'

const EXCEL_PATHNAME = 'portfolio-submissions.xlsx'
const KV_EXCEL_KEY = 'portfolio:excel_file'
const MAX_ITEMS = 250

const MESSAGE_HEADERS = ['ID', 'Date', 'Name', 'Email', 'Subject', 'Message']
const RATING_HEADERS = ['ID', 'Date', 'Name', 'Stars', 'Comment']

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export function isKvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export function isExcelStorageReady() {
  return isBlobConfigured() || isKvConfigured()
}

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN
}

async function getBlobUrl() {
  const { blobs } = await list({ prefix: EXCEL_PATHNAME, token: blobToken() })
  return blobs[0]?.url || null
}

function ensureMessageSheet(wb) {
  let sheet = wb.getWorksheet('Messages')
  if (!sheet) {
    sheet = wb.addWorksheet('Messages')
    sheet.addRow(MESSAGE_HEADERS)
    styleHeader(sheet)
  }
  return sheet
}

function ensureRatingSheet(wb) {
  let sheet = wb.getWorksheet('Ratings')
  if (!sheet) {
    sheet = wb.addWorksheet('Ratings')
    sheet.addRow(RATING_HEADERS)
    styleHeader(sheet)
  }
  return sheet
}

function styleHeader(sheet) {
  const row = sheet.getRow(1)
  row.font = { bold: true }
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A5F' },
  }
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } }
}

async function loadWorkbook() {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Anil Portfolio'
  wb.created = new Date()

  if (isBlobConfigured()) {
    const url = await getBlobUrl()
    if (url) {
      const res = await fetch(url)
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        await wb.xlsx.load(buf)
      }
    }
  } else if (isKvConfigured()) {
    const b64 = await kv.get(KV_EXCEL_KEY)
    if (b64 && typeof b64 === 'string') {
      await wb.xlsx.load(Buffer.from(b64, 'base64'))
    }
  }

  ensureMessageSheet(wb)
  ensureRatingSheet(wb)
  return wb
}

async function saveWorkbook(wb) {
  const buffer = await wb.xlsx.writeBuffer()

  if (isBlobConfigured()) {
    await put(EXCEL_PATHNAME, buffer, {
      access: 'public',
      token: blobToken(),
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    return
  }

  if (isKvConfigured()) {
    await kv.set(KV_EXCEL_KEY, Buffer.from(buffer).toString('base64'))
    return
  }

  throw new Error('EXCEL_STORAGE_NOT_CONFIGURED')
}

function rowToMessage(row) {
  const id = Number(row.getCell(1).value)
  if (!id) return null
  return {
    id,
    date: String(row.getCell(2).value ?? ''),
    name: String(row.getCell(3).value ?? ''),
    email: String(row.getCell(4).value ?? ''),
    subject: String(row.getCell(5).value ?? ''),
    message: String(row.getCell(6).value ?? ''),
  }
}

function rowToRating(row) {
  const id = Number(row.getCell(1).value)
  if (!id) return null
  return {
    id,
    date: String(row.getCell(2).value ?? ''),
    name: String(row.getCell(3).value ?? ''),
    stars: Math.min(5, Math.max(1, Math.round(Number(row.getCell(4).value) || 0))),
    comment: String(row.getCell(5).value ?? ''),
  }
}

function parseMessagesSheet(sheet) {
  const items = []
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const msg = rowToMessage(row)
    if (msg) items.push(msg)
  })
  return items.sort((a, b) => b.id - a.id).slice(0, MAX_ITEMS)
}

function parseRatingsSheet(sheet) {
  const items = []
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const r = rowToRating(row)
    if (r) items.push(r)
  })
  return items.sort((a, b) => b.id - a.id).slice(0, MAX_ITEMS)
}

function rewriteSheet(sheet, headers, rows) {
  sheet.spliceRows(1, sheet.rowCount)
  sheet.addRow(headers)
  styleHeader(sheet)
  rows.forEach((cells) => sheet.addRow(cells))
}

export async function getMessagesFromExcel() {
  const wb = await loadWorkbook()
  return parseMessagesSheet(ensureMessageSheet(wb))
}

export async function getRatingsFromExcel() {
  const wb = await loadWorkbook()
  return parseRatingsSheet(ensureRatingSheet(wb))
}

export async function addMessageToExcel(entry) {
  const wb = await loadWorkbook()
  const sheet = ensureMessageSheet(wb)
  sheet.spliceRows(2, 0, [
    entry.id,
    entry.date,
    entry.name,
    entry.email,
    entry.subject || '',
    entry.message,
  ])
  await saveWorkbook(wb)
  return getMessagesFromExcel()
}

export async function addRatingToExcel(entry) {
  const wb = await loadWorkbook()
  const sheet = ensureRatingSheet(wb)
  sheet.spliceRows(2, 0, [
    entry.id,
    entry.date,
    entry.name,
    entry.stars,
    entry.comment || '',
  ])
  await saveWorkbook(wb)
  return getRatingsFromExcel()
}

export async function setMessagesInExcel(messages) {
  const wb = await loadWorkbook()
  const sheet = ensureMessageSheet(wb)
  rewriteSheet(
    sheet,
    MESSAGE_HEADERS,
    messages.map((m) => [m.id, m.date, m.name, m.email, m.subject || '', m.message])
  )
  await saveWorkbook(wb)
  return messages
}

export async function setRatingsInExcel(ratings) {
  const wb = await loadWorkbook()
  const sheet = ensureRatingSheet(wb)
  rewriteSheet(
    sheet,
    RATING_HEADERS,
    ratings.map((r) => [r.id, r.date, r.name, r.stars, r.comment || ''])
  )
  await saveWorkbook(wb)
  return ratings
}

export async function deleteMessageFromExcel(id) {
  const messages = (await getMessagesFromExcel()).filter((m) => m.id !== id)
  return setMessagesInExcel(messages)
}

export async function deleteRatingFromExcel(id) {
  const ratings = (await getRatingsFromExcel()).filter((r) => r.id !== id)
  return setRatingsInExcel(ratings)
}

/** Build Excel file from in-memory lists (export / KV fallback) */
export async function buildExcelBuffer(messages = [], ratings = []) {
  const wb = new ExcelJS.Workbook()
  const msgSheet = wb.addWorksheet('Messages')
  msgSheet.addRow(MESSAGE_HEADERS)
  styleHeader(msgSheet)
  messages.forEach((m) => {
    msgSheet.addRow([m.id, m.date, m.name, m.email, m.subject || '', m.message])
  })

  const rateSheet = wb.addWorksheet('Ratings')
  rateSheet.addRow(RATING_HEADERS)
  styleHeader(rateSheet)
  ratings.forEach((r) => {
    rateSheet.addRow([r.id, r.date, r.name, r.stars, r.comment || ''])
  })

  return wb.xlsx.writeBuffer()
}

export async function getExcelDownloadBuffer() {
  if (isBlobConfigured()) {
    const url = await getBlobUrl()
    if (url) {
      const res = await fetch(url)
      if (res.ok) return Buffer.from(await res.arrayBuffer())
    }
  }
  if (isKvConfigured()) {
    const b64 = await kv.get(KV_EXCEL_KEY)
    if (b64 && typeof b64 === 'string') {
      return Buffer.from(b64, 'base64')
    }
  }
  return null
}
