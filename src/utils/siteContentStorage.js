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

function isPlaceholderExperience(job) {
  if (!job) return true
  const title = (job.title || '').trim()
  const company = (job.company || '').trim()
  const location = (job.location || '').trim()
  const bullets = Array.isArray(job.bullets) ? job.bullets.join(' ') : String(job.bullets || '')
  if (!title || !company) return true
  if (/job title/i.test(title)) return true
  if (/company name/i.test(company)) return true
  if (/^city,\s*country$/i.test(location)) return true
  if (/describe your impact/i.test(bullets)) return true
  return false
}

function cleanExperience(list = []) {
  return list.filter((j) => !isPlaceholderExperience(j))
}

function migrateSiteContent(merged, defaults) {
  const version = Number(merged.version) || 1
  let next = { ...merged }

  if (version < 2) {
    const hasEcolab = (next.experience || []).some(
      (j) => j.id === 'ecolab' || /ecolab/i.test(j?.company || '')
    )

    let experience = next.experience || []
    if (!hasEcolab) {
      const ecolab = defaults.experience.find((j) => j.id === 'ecolab')
      experience = [
        ecolab,
        ...experience.map((j) => {
          if (j.id === 'rokkun' || /rokkun/i.test(j?.company || '')) {
            return { ...j, period: 'Apr 2026 – Jul 2026', current: false }
          }
          return { ...j, current: false }
        }),
      ].filter(Boolean)
    }

    next = {
      ...next,
      version: 2,
      summary: defaults.summary,
      contact: {
        ...next.contact,
        title: defaults.contact.title,
      },
      experience,
      home: {
        ...next.home,
        heroStatus: defaults.home.heroStatus,
        photoCard1: defaults.home.photoCard1,
        ctaTitle: defaults.home.ctaTitle,
        ctaText: defaults.home.ctaText,
      },
      about: {
        ...next.about,
      },
    }
  }

  const before = next.experience || []
  const cleaned = cleanExperience(before)
  const removedPlaceholders = cleaned.length !== before.length

  // v4: permanently drop unfinished admin draft jobs from storage
  if ((Number(next.version) || 1) < 4 || removedPlaceholders) {
    next = {
      ...next,
      version: Math.max(Number(next.version) || 1, 4),
      experience: cleaned.length ? cleaned : defaults.experience,
    }
  }

  // v6: replace stale/legacy experience (Tap Academy, Senior AI Engineer, etc.)
  // with the canonical resume timeline so About cards render correctly again
  if ((Number(next.version) || 1) < 6) {
    next = {
      ...next,
      version: 6,
      summary: defaults.summary,
      contact: {
        ...defaults.contact,
        emailjs: { ...(defaults.contact.emailjs || {}), ...(next.contact?.emailjs || {}) },
        email: next.contact?.email || defaults.contact.email,
        phone: next.contact?.phone || defaults.contact.phone,
        linkedin: next.contact?.linkedin || defaults.contact.linkedin,
        github: next.contact?.github || defaults.contact.github,
      },
      experience: defaults.experience.map((e) => ({
        ...e,
        bullets: [...(e.bullets || [])],
        tags: [...(e.tags || [])],
      })),
      education: defaults.education.map((e) => ({ ...e })),
      certifications: defaults.certifications.map((c) => ({ ...c })),
      skillCategories: defaults.skillCategories.map((c) => ({
        ...c,
        skills: [...(c.skills || [])],
      })),
      about: {
        tags: [...(defaults.about.tags || [])],
        extraParagraphs: [...(defaults.about.extraParagraphs || [])],
      },
    }
  }

  return next
}

export function getSiteContent() {
  const defaults = getDefaultContent()
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY)
    if (!raw) return defaults
    const saved = JSON.parse(raw)
    const merged = migrateSiteContent(deepMerge(defaults, saved), defaults)
    const shouldPersist =
      (Number(saved.version) || 1) < 6 ||
      (saved.experience || []).some((j) => isPlaceholderExperience(j))
    if (shouldPersist) {
      try {
        localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(merged))
      } catch {
        /* ignore quota errors during migration */
      }
    }
    return merged
  } catch {
    return defaults
  }
}

export function saveSiteContent(content) {
  // Throws if localStorage quota is exceeded — callers should catch this
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
