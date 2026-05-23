import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageBack from '../components/PageBack'
import useScrollReveal from '../hooks/useScrollReveal'
import ProjectCard from '../components/ProjectCard'
import { useSiteContent } from '../context/SiteContentContext'

export default function Projects() {
  const { content } = useSiteContent()
  const PROJECTS = content.projects
  const PROJECT_CATEGORIES = content.projectCategories
  const pageRef = useScrollReveal()
  const [activeTab, setActiveTab] = useState('All')

  const filteredProjects = activeTab === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.cat === activeTab)

  return (
    <div ref={pageRef}>
      <div className="sec-wrap">
        <div className="container page-hero-wrap" id="projects">
          <PageBack />
          <div className="eyebrow rv">Portfolio</div>
          <h1 className="sec-title rv">Featured <span>Projects</span></h1>
          <p className="sec-sub rv">Production AI platforms, enterprise tools at GSK GCC, and full-stack applications from my resume.</p>

          <div className="filter-bar rv d1">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="proj-grid">
            {filteredProjects.map((proj, i) => (
              <ProjectCard key={proj.id} project={proj} delayClass={i > 0 ? `d${Math.min(i, 4)}` : ''} />
            ))}
          </div>
        </div>
      </div>

      <section className="sec-wrap alt cta-section">
        <div className="container cta-inner">
          <h2 className="sec-title">Want to <span>Collaborate?</span></h2>
          <p className="sec-sub cta-sub">I'm always interested in discussing new projects, innovative ideas, and opportunities to make a difference.</p>
          <Link to="/contact" className="btn-grd">Let's Work Together</Link>
        </div>
      </section>
    </div>
  )
}
