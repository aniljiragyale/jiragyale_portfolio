import { kv } from '@vercel/kv'

const MESSAGES_KEY = 'portfolio:messages'
const RATINGS_KEY = 'portfolio:ratings'
const MAX_ITEMS = 250

export function isKvConfigured() {
  return Boolean(
    process.env.KV_REST_API_URL &&
      process.env.KV_REST_API_TOKEN
  )
}

async function readList(key) {
  if (!isKvConfigured()) return null
  try {
    const data = await kv.get(key)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('KV read error:', err)
    return null
  }
}

async function writeList(key, list) {
  if (!isKvConfigured()) {
    throw new Error('KV_NOT_CONFIGURED')
  }
  await kv.set(key, list.slice(0, MAX_ITEMS))
}

export async function getMessages() {
  return (await readList(MESSAGES_KEY)) ?? []
}

export async function addMessage(entry) {
  const list = (await readList(MESSAGES_KEY)) ?? []
  const next = [entry, ...list.filter((m) => m.id !== entry.id)].slice(0, MAX_ITEMS)
  await writeList(MESSAGES_KEY, next)
  return next
}

export async function setMessages(messages) {
  await writeList(MESSAGES_KEY, messages)
  return messages
}

export async function deleteMessage(id) {
  const list = (await readList(MESSAGES_KEY)) ?? []
  const next = list.filter((m) => m.id !== id)
  await writeList(MESSAGES_KEY, next)
  return next
}

export async function getRatings() {
  return (await readList(RATINGS_KEY)) ?? []
}

export async function addRating(entry) {
  const list = (await readList(RATINGS_KEY)) ?? []
  const next = [entry, ...list.filter((r) => r.id !== entry.id)].slice(0, MAX_ITEMS)
  await writeList(RATINGS_KEY, next)
  return next
}

export async function setRatings(ratings) {
  await writeList(RATINGS_KEY, ratings)
  return ratings
}

export async function deleteRating(id) {
  const list = (await readList(RATINGS_KEY)) ?? []
  const next = list.filter((r) => r.id !== id)
  await writeList(RATINGS_KEY, next)
  return next
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
