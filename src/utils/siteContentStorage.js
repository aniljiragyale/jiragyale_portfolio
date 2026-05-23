import { getDefaultSiteContent } from '../data/siteContentDefaults'

const SITE_CONTENT_KEY = 'portfolio_site_content'

function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target
  const out = Array.isArray(target) ? [...target] : { ...target }
  Object.keys(source).forEach((key) => {
    const srcVal = source[key]
    const tgtVal = out[key]
    if (Array.isArray(srcVal)) {
      out[key] = srcVal.map((item) =>
        typeof item === 'object' && item !== null ? { ...item } : item
      )
    } else if (srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
      out[key] = deepMerge(
        tgtVal && typeof tgtVal === 'object' ? tgtVal : {},
        srcVal
      )
    } else if (srcVal !== undefined) {
      out[key] = srcVal
    }
  })
  return out
}

export function getDefaultContent() {
  return getDefaultSiteContent()
}

export function getSiteContent() {
  const defaults = getDefaultContent()
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY)
    if (!raw) return defaults
    const saved = JSON.parse(raw)
    return deepMerge(defaults, saved)
  } catch {
    return defaults
  }
}

export function saveSiteContent(content) {
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content))
  window.dispatchEvent(new CustomEvent('portfolio-site-content-updated'))
}

export function resetSiteContent() {
  localStorage.removeItem(SITE_CONTENT_KEY)
  window.dispatchEvent(new CustomEvent('portfolio-site-content-updated'))
}

export function exportSiteContentJson(content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `portfolio-content-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importSiteContentFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        const merged = deepMerge(getDefaultContent(), parsed)
        saveSiteContent(merged)
        resolve(merged)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export async function readResumeFileAsDataUrl(file) {
  const maxBytes = 4 * 1024 * 1024
  if (file.size > maxBytes) {
    throw new Error('Resume must be under 4 MB.')
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
