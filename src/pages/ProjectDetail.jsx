import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import PageBack from '../components/PageBack'
import { useSiteContent } from '../context/SiteContentContext'
import { getProjectById, PROJECTS as DEFAULT_PROJECTS } from '../data/projects'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const { content } = useSiteContent()
  const stored = getProjectById(projectId, content.projects)
  const defaults = getProjectById(projectId, DEFAULT_PROJECTS)
  const base = stored ?? defaults
  const project = base
    ? {
        ...defaults,
        ...base,
        tags: base.tags?.length ? base.tags : defaults?.tags || [],
        details: {
          ...(defaults?.details || {}),
          ...(base.details || {}),
          highlights: base.details?.highlights?.length
            ? base.details.highlights
            : defaults?.details?.highlights || [],
          outcomes: base.details?.outcomes?.length
            ? base.details.outcomes
            : defaults?.details?.outcomes || [],
        },
      }
    : null
  const [imgSrc, setImgSrc] = useState(project?.img || FALLBACK_IMG)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const details = project.details || {}
  const hasCodeLink = project.link?.startsWith('http')
  const highlights = details.highlights || []
  const outcomes = details.outcomes || []

  return (
    <main className="project-detail-page">
      <section className="sec-wrap">
        <section className="container page-hero-wrap project-detail-wrap">
          <PageBack to="/projects" label="Back to Projects" />
          <section className="project-detail-hero">
            <section className="project-detail-media">
              <img
                src={imgSrc}
                alt={project.title}
                className="project-detail-img"
                onError={() => setImgSrc(FALLBACK_IMG)}
              />
              <span className="project-detail-media-overlay" aria-hidden="true" />
              <span className="proj-cat-badge">{project.cat}</span>
            </section>
          </section>

          <header className="project-detail-header">
            <span className={`pbadge ${project.badgeCls}`}>{project.badge}</span>
            <h1 className="sec-title project-detail-title">{project.title}</h1>
            {details.role && <p className="project-detail-role">{details.role}</p>}
            <p className="project-detail-summary">{project.desc}</p>
            <section className="proj-stack project-detail-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="ps-tag">{tag}</span>
              ))}
            </section>
          </header>

          <section className="project-detail-grid">
            <section className="project-detail-main">
              {details.overview && (
                <section className="project-detail-section">
                  <h2 className="project-detail-heading">Overview</h2>
                  <p className="project-detail-text">{details.overview}</p>
                </section>
              )}

              {highlights.length > 0 && (
                <section className="project-detail-section">
                  <h2 className="project-detail-heading">Key Contributions</h2>
                  <ul className="project-detail-list">
                    {highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
            </section>

            <aside className="project-detail-sidebar">
              {outcomes.length > 0 && (
                <section className="project-detail-card">
                  <h3 className="project-detail-card-title">Impact</h3>
                  <ul className="project-detail-outcomes">
                    {outcomes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="project-detail-card">
                <h3 className="project-detail-card-title">Tech Stack</h3>
                <section className="proj-stack">
                  {project.tags.map((tag) => (
                    <span key={`side-${tag}`} className="ps-tag">{tag}</span>
                  ))}
                </section>
              </section>

              <section className="project-detail-actions">
                {hasCodeLink && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-grd"
                  >
                    View Code <i className="fab fa-github" />
                  </a>
                )}
                <Link to="/contact" className="btn-ghost">Discuss This Project →</Link>
                <Link to="/projects" className="btn-ghost">All Projects</Link>
              </section>
            </aside>
          </section>
        </section>
      </section>
    </main>
  )
}
