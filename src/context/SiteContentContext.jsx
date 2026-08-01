import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getDefaultContent,
  getSiteContent,
  resetSiteContent,
  saveSiteContent,
  exportSiteContentJson,
  importSiteContentFromFile,
} from '../utils/siteContentStorage'
import {
  getResumeDownloadUrl,
  getResumeFileName,
  getFeaturedProjects,
} from '../data/siteContentDefaults'

const SiteContentContext = createContext(null)

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => getSiteContent())

  const reload = useCallback(() => {
    setContent(getSiteContent())
  }, [])

  // Drop leftover admin draft jobs (e.g. "Job Title / Company Name") on first load
  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    const onUpdate = () => reload()
    window.addEventListener('portfolio-site-content-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('portfolio-site-content-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [reload])

  const persist = useCallback((next) => {
    saveSiteContent(next) // throws if localStorage quota exceeded
    setContent(next)
  }, [])

  const updateContent = useCallback(
    (patch) => {
      persist({ ...content, ...patch })
    },
    [content, persist]
  )

  const replaceContent = useCallback(
    (next) => {
      persist(next)
    },
    [persist]
  )

  const resetContent = useCallback(() => {
    resetSiteContent()
    setContent(getDefaultContent())
  }, [])

  const value = useMemo(
    () => ({
      content,
      updateContent,
      replaceContent,
      resetContent,
      reload,
      exportJson: () => exportSiteContentJson(content),
      importJson: async (file) => {
        const merged = await importSiteContentFromFile(file)
        setContent(merged)
        return merged
      },
      resumeUrl: getResumeDownloadUrl(content),
      resumeFileName: getResumeFileName(content),
      featuredProjects: getFeaturedProjects(content),
    }),
    [content, updateContent, replaceContent, resetContent, reload]
  )

  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) {
    throw new Error('useSiteContent must be used within SiteContentProvider')
  }
  return ctx
}
