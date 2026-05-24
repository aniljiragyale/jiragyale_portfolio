import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import ProjectCard from '../components/ProjectCard'
import SkillsShowcase from '../components/SkillsShowcase'
import PortfolioRating from '../components/PortfolioRating'
import { useSiteContent } from '../context/SiteContentContext'
import anilImg from '../assets/anil image professional.jpeg'

const DEFAULT_SERVICES = [
  {
    icon: '🤖',
    cls: '',
    title: 'AI & LLM Engineering',
    desc: 'Building production-grade LLM applications, RAG pipelines, semantic search systems, and intelligent agents using LangChain, OpenAI, and open-source models.',
    tags: ['LangChain', 'LangGraph', 'RAG', 'Milvus', 'LLM']
  },
  {
    icon: '⚡',
    cls: 'purple',
    title: 'Full Stack Development',
    desc: 'End-to-end application development from responsive React frontends to scalable FastAPI/Node.js backends with clean architecture and robust APIs.',
    tags: ['React', 'FastAPI', 'Node.js', 'TypeScript', 'PostgreSQL']
  },
  {
    icon: '☁️',
    cls: 'gold',
    title: 'Cloud & DevOps',
    desc: 'Architecting cloud infrastructure, CI/CD pipelines, containerised deployments with monitoring, auto-scaling, and disaster recovery built in from day one.',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD']
  }
]

const DEFAULT_TESTIMONIALS = [
  {
    text: "Anil delivered an AI-powered market intelligence platform that exceeded our expectations. His deep understanding of LLM systems and ability to translate complex requirements into clean, scalable code is remarkable.",
    name: 'Rokkun Systems',
    role: 'Engineering Team Lead',
    initials: 'RS'
  },
  {
    text: "The semantic search API Anil built handles millions of queries with sub-100ms response times. His expertise in vector embeddings and system optimisation saved us months of development time.",
    name: 'GSK GCC',
    role: 'Data Science Department',
    initials: 'GK'
  },
  {
    text: "Working with Anil on our data pipeline was a pleasure. He brings technical excellence and genuine curiosity about the problem domain — a strong combination on any engineering team.",
    name: 'Tech Collaborator',
    role: 'Software Architect',
    initials: 'TC'
  },
  {
    text: "Anil's RAG system reduced our manual documentation effort by 40%. He's the kind of engineer who thinks about long-term maintainability, not just shipping fast.",
    name: 'Enterprise Client',
    role: 'Product Manager',
    initials: 'EC'
  }
]

export default function Home() {
  const { content, resumeUrl, resumeFileName, featuredProjects } = useSiteContent()
  const CONTACT = content.contact
  const SUMMARY = content.summary
  const SERVICES = content.home?.services?.length ? content.home.services : DEFAULT_SERVICES
  const TESTIMONIALS = content.home?.testimonials?.length ? content.home.testimonials : DEFAULT_TESTIMONIALS
  const HOME = content.home || {}
  const METRICS = HOME.metrics?.length ? HOME.metrics : [
    { n: '2+', l: 'Years AI/FS Dev' },
    { n: '3+', l: 'Prod Platforms' },
    { n: '100+', l: 'Enterprise Users' },
    { n: '20+', l: 'Tech Stack' },
  ]
  const STATS = HOME.statsBar?.length ? HOME.statsBar : [
    { n: '30%', l: 'Query Accuracy Improvement' },
    { n: '40%', l: 'Manual Effort Reduced' },
    { n: '10K+', l: 'Documents Indexed (Semantic Search)' },
    { n: '100ms', l: 'Search API Response Time' },
  ]
  const pageRef = useScrollReveal()

  // Hero reveal on mount
  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.hero-section .rv').forEach((el, i) => {
        setTimeout(() => el.classList.add('on'), i * 100)
      })
    }, 100)
  }, [])


  return (
    <div ref={pageRef}>
      {/* ══ HERO ══ */}
      <section className="hero-section">
        <div className="hero-bg-orb" />
        <div className="hero-bg-orb2" />

        <div className="hero-top">
        <div className="hero-content">
          <div className="hero-status rv">
            <span className="blink"></span>
            {HOME.heroStatus || 'Open to Full-Time Opportunities'}
          </div>

          <h1 className="hero-name hero-name-full rv d1">
            {CONTACT.name.replace(/\s+Jiragyale$/i, '')}{' '}
            <em>Jiragyale</em>
          </h1>

          <p className="hero-tagline rv d2">
            {CONTACT.tagline}
          </p>

          <p className="hero-desc rv d2">
            {SUMMARY.split('Delivered')[0].trim()}
            {' '}Delivered <strong>3+ production platforms</strong> for <strong>100+ users</strong> at{' '}
            <strong>GSK GCC</strong> and <strong>Rokkun Systems</strong> — improving query accuracy by{' '}
            <strong>30%</strong> and reducing manual effort by <strong>~40%</strong>.
          </p>

          <div className="hero-actions rv d3">
            <Link to="/projects" className="btn-grd">View Projects ✦</Link>
            <Link to="/contact" className="btn-ghost">Contact Me →</Link>
            <a href={resumeUrl} download={resumeFileName} className="btn-ghost">
              Download Resume <i className="fas fa-download" style={{ marginLeft: '4px' }}></i>
            </a>
            <div className="hero-socials" aria-label="Social links">
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="btn-sq" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href={CONTACT.github} target="_blank" rel="noreferrer" className="btn-sq" title="GitHub"><i className="fab fa-github"></i></a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="btn-sq" title="Phone"><i className="fas fa-phone"></i></a>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="photo-container">
            <div className="photo-ring"></div>
            <div className="photo-glow"></div>
            <img src={anilImg} alt="Anil Jiragyale" className="photo-img" />
            <div className="photo-card">
              <div className="pc-big">{HOME.photoCard1?.big || 'Full Stack AI 🚀'}</div>
              <div className="pc-sm">{HOME.photoCard1?.sm || 'Rokkun · GSK GCC · Bangalore'}</div>
            </div>
            <div className="photo-card2">
              <div className="pc2-big">{HOME.photoCard2?.big || 'LLM & RAG ✦'}</div>
              <div className="pc2-sm">{HOME.photoCard2?.sm || '100+ Enterprise Users'}</div>
            </div>
          </div>
        </div>
        </div>

        <div className="hero-metrics rv d4">
          {METRICS.map((m, i) => (
            <div key={`metric-${i}`} className="metric">
              <div className="metric-n">{m.n}</div>
              <div className="metric-l">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="sec-wrap alt">
        <div className="container" style={{paddingTop:'3rem', paddingBottom:'3rem'}}>
          <div className="stats-bar">
            {STATS.map((s, i) => (
              <div key={`stat-${i}`} className={`stat-item rv${i ? ` d${i}` : ''}`}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ WHAT I DO ══ */}
      <div className="sec-wrap">
        <div className="container">
          <div className="eyebrow rv">What I Do</div>
          <h2 className="sec-title rv">My Core <span>Expertise</span></h2>
          <p className="sec-sub rv">Specialised in building production-ready AI systems, scalable backends, and seamless cloud infrastructure.</p>

          <div className="services-grid">
            {SERVICES.map((svc, i) => (
              <div key={i} className={`service-card rv d${i}`}>
                <div className={`svc-icon ${svc.cls}`}>{svc.icon}</div>
                <div className="svc-title">{svc.title}</div>
                <div className="svc-desc">{svc.desc}</div>
                <div className="svc-tags">
                  {svc.tags.map(t => <span key={t} className="svc-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SKILLS PREVIEW ══ */}
      <div className="sec-wrap alt">
        <div className="container">
          <div className="eyebrow rv">Technical Arsenal</div>
          <h2 className="sec-title rv">Skills <span>Overview</span></h2>
          <p className="sec-sub rv">Core technologies from my resume — AI/ML, full stack, cloud, and data engineering.</p>

          <SkillsShowcase />

          <div style={{textAlign:'center', marginTop:'2.5rem'}}>
            <Link to="/about" className="btn-ghost rv">View All Skills &amp; Experience →</Link>
          </div>
        </div>
      </div>

      {/* ══ FEATURED PROJECTS ══ */}
      <div className="sec-wrap">
        <div className="container">
          <div className="eyebrow rv">Portfolio</div>
          <h2 className="sec-title rv">Featured <span>Projects</span></h2>
          <p className="sec-sub rv">Production AI platforms, enterprise tools at GSK GCC, and full-stack applications from my resume.</p>

          <div className="proj-grid proj-grid-featured">
            {featuredProjects.map((proj, i) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                featured
                delayClass={`d${Math.min(i, 4)}`}
              />
            ))}
          </div>

          <div style={{textAlign:'center', marginTop:'2.5rem'}}>
            <Link to="/projects" className="btn-grd rv">View All Projects ✦</Link>
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <div className="sec-wrap alt">
        <div className="container">
          <div className="eyebrow rv">Social Proof</div>
          <h2 className="sec-title rv">What People <span>Say</span></h2>
          <div className="testimonials-grid" style={{marginTop:'2rem'}}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card rv d${i % 4}`}>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ PORTFOLIO RATING ══ */}
      <div className="sec-wrap">
        <div className="container">
          <PortfolioRating />
        </div>
      </div>

      {/* ══ CTA ══ */}
      <div className="sec-wrap alt">
        <div className="container">
          <div className="cta-banner rv">
            <h2 className="cta-title">{HOME.ctaTitle || 'Ready to Build Something Amazing?'}</h2>
            <p>{HOME.ctaText || "I'm actively seeking full-time roles in AI Engineering, Full Stack Development, or Product-Driven Companies."}</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-grd">Get In Touch ✦</Link>
              <Link to="/projects" className="btn-ghost">See My Work →</Link>
              <a
                href={resumeUrl}
                download={resumeFileName}
                className="btn-ghost"
                target="_blank"
                rel="noreferrer"
              >
                Download Resume <i className="fas fa-download" style={{ marginLeft: '4px' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
