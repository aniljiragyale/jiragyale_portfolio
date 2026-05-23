import { kv } from '@vercel/kv'
import {
  isExcelStorageReady,
  isBlobConfigured,
  isKvConfigured,
  getMessagesFromExcel,
  getRatingsFromExcel,
  addMessageToExcel,
  addRatingToExcel,
  setMessagesInExcel,
  setRatingsInExcel,
  deleteMessageFromExcel,
  deleteRatingFromExcel,
  buildExcelBuffer,
} from './excelStore.js'

const MESSAGES_KEY = 'portfolio:messages'
const RATINGS_KEY = 'portfolio:ratings'
export function isStorageConfigured() {
  return isExcelStorageReady()
}

export function getStorageMode() {
  if (!isStorageConfigured()) return 'none'
  return 'excel'
}

async function readLegacyKvList(key) {
  if (!isKvConfigured()) return []
  try {
    const data = await kv.get(key)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/** Import old JSON rows into Excel once, if Excel sheets are empty */
async function migrateLegacyJsonToExcel() {
  const messages = await getMessagesFromExcel()
  const ratings = await getRatingsFromExcel()
  if (messages.length > 0 || ratings.length > 0) return

  const legacyMessages = await readLegacyKvList(MESSAGES_KEY)
  const legacyRatings = await readLegacyKvList(RATINGS_KEY)
  if (!legacyMessages.length && !legacyRatings.length) return

  if (legacyMessages.length) await setMessagesInExcel(legacyMessages)
  if (legacyRatings.length) await setRatingsInExcel(legacyRatings)
}

export async function getMessages() {
  if (!isStorageConfigured()) return []
  await migrateLegacyJsonToExcel()
  return getMessagesFromExcel()
}

export async function addMessage(entry) {
  if (!isStorageConfigured()) throw new Error('STORAGE_NOT_CONFIGURED')
  return addMessageToExcel(entry)
}

export async function setMessages(messages) {
  if (!isStorageConfigured()) throw new Error('STORAGE_NOT_CONFIGURED')
  return setMessagesInExcel(messages)
}

export async function deleteMessage(id) {
  if (!isStorageConfigured()) throw new Error('STORAGE_NOT_CONFIGURED')
  return deleteMessageFromExcel(id)
}

export async function getRatings() {
  if (!isStorageConfigured()) return []
  await migrateLegacyJsonToExcel()
  return getRatingsFromExcel()
}

export async function addRating(entry) {
  if (!isStorageConfigured()) throw new Error('STORAGE_NOT_CONFIGURED')
  return addRatingToExcel(entry)
}

export async function setRatings(ratings) {
  if (!isStorageConfigured()) throw new Error('STORAGE_NOT_CONFIGURED')
  return setRatingsInExcel(ratings)
}

export async function deleteRating(id) {
  if (!isStorageConfigured()) throw new Error('STORAGE_NOT_CONFIGURED')
  return deleteRatingFromExcel(id)
}

export function computeRatingStats(ratings) {
  if (!ratings.length) {
    return { count: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  }
  const sum = ratings.reduce((acc, r) => acc + r.stars, 0)
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratings.forEach((r) => {
    distribution[r.stars] = (distribution[r.stars] || 0) + 1
  })
  return {
    count: ratings.length,
    average: Math.round((sum / ratings.length) * 10) / 10,
    distribution,
  }
}

export async function buildExportBuffer() {
  const messages = await getMessages()
  const ratings = await getRatings()
  return buildExcelBuffer(messages, ratings)
}

export { isBlobConfigured, isKvConfigured }
