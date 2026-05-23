/**
 * Run: node --env-file=.env scripts/test-kv-storage.mjs
 * Tests Excel + KV storage (same as production API).
 */
import { addMessage, addRating, getMessages, getRatings, isStorageConfigured } from '../api/lib/portfolioStore.js'

if (!isStorageConfigured()) {
  console.error('FAIL: KV_REST_API_URL and KV_REST_API_TOKEN must be set in .env')
  process.exit(1)
}

const testId = Date.now()
const testMessage = {
  id: testId,
  name: 'Test User',
  email: 'test@example.com',
  subject: 'KV storage test',
  message: 'Automated test after deploy setup',
  date: new Date().toLocaleString(),
}

const testRating = {
  id: testId + 1,
  stars: 5,
  name: 'Test Rater',
  comment: 'Storage test rating',
  date: new Date().toLocaleString(),
}

console.log('Adding test message...')
await addMessage(testMessage)

console.log('Adding test rating...')
await addRating(testRating)

const messages = await getMessages()
const ratings = await getRatings()

const hasMsg = messages.some((m) => m.id === testId)
const hasRating = ratings.some((r) => r.id === testId + 1)

console.log('Messages count:', messages.length, hasMsg ? '✓ test message found' : '✗ message missing')
console.log('Ratings count:', ratings.length, hasRating ? '✓ test rating found' : '✗ rating missing')

if (!hasMsg || !hasRating) {
  process.exit(1)
}

console.log('SUCCESS: Excel storage via KV is working.')
