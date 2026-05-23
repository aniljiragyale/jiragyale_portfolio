import { useState } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80'

export default function ProjectCard({ project, delayClass = '', featured = false, showDetailsLink = false }) {
  const linkIsExternal = project.link?.startsWith('http')
  const [imgSrc, setImgSrc] = useState(project.img)

  return (
    <article className={`proj-card ${featured ? 'feat' : ''} rv ${delayClass}`}>
      <div className="proj-img-wrap">
        <img
          src={imgSrc}
          alt={project.title}
          className="proj-img"
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMG)}
        />
        <div className="proj-overlay" />
        <div className="proj-cat-badge">{project.cat}</div>
      </div>
      <div className="proj-body">
        <h3 className="proj-name">{project.title}</h3>
        <p className="proj-desc">{project.desc}</p>
        <div className="proj-stack">
          {project.tags.map((tag) => (
            <span key={tag} className="ps-tag">{tag}</span>
          ))}
        </div>
        <div className="proj-foot">
          <span className={`pbadge ${project.badgeCls}`}>{project.badge}</span>
          {showDetailsLink ? (
            <Link to="/projects" className="proj-link">View Details →</Link>
          ) : linkIsExternal ? (
            <a href={project.link} target="_blank" rel="noreferrer" className="proj-link">View Code →</a>
          ) : (
            <a href={project.link} className="proj-link">View Details →</a>
          )}
        </div>
      </div>
    </article>
  )
}
