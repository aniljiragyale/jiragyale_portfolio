import { useState } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80'

export default function ProjectCard({ project, delayClass = '', featured = false }) {
  const hasCodeLink = project.link?.startsWith('http')
  const [imgSrc, setImgSrc] = useState(project.img)

  return (
    <article className={`proj-card ${featured ? 'feat' : ''} rv ${delayClass}`}>
      <section className="proj-img-wrap">
        <img
          src={imgSrc}
          alt={project.title}
          className="proj-img"
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMG)}
        />
        <span className="proj-overlay" aria-hidden="true" />
        <span className="proj-cat-badge">{project.cat}</span>
      </section>
      <section className="proj-body">
        <h3 className="proj-name">{project.title}</h3>
        <p className="proj-desc">{project.desc}</p>
        <section className="proj-stack">
          {project.tags.map((tag) => (
            <span key={tag} className="ps-tag">{tag}</span>
          ))}
        </section>
        <footer className="proj-foot">
          <span className={`pbadge ${project.badgeCls}`}>{project.badge}</span>
          <section className="proj-foot-links">
            <Link to={`/projects/${project.id}`} className="proj-link">View Details →</Link>
            {hasCodeLink && (
              <a href={project.link} target="_blank" rel="noreferrer" className="proj-link proj-link-code">
                View Code →
              </a>
            )}
          </section>
        </footer>
      </section>
    </article>
  )
}
