import PageBack from '../components/PageBack'
import useScrollReveal from '../hooks/useScrollReveal'
import anilImg from '../assets/anil image professional.jpeg'
import { useSiteContent } from '../context/SiteContentContext'

export default function About() {
  const { content, resumeUrl, resumeFileName } = useSiteContent()
  const { summary: SUMMARY, experience: EXPERIENCE, education: EDUCATION, certifications: CERTIFICATIONS, skillCategories: SKILL_CATEGORIES, about } = content
  const pageRef = useScrollReveal()

  return (
    <div ref={pageRef}>
      <div className="sec-wrap">
        <div className="container page-hero-wrap" id="about">
          <PageBack />
          <div className="eyebrow rv">Who am I?</div>
          <h1 className="sec-title rv">About <span>Me</span></h1>

          <div className="about-grid">
            <div className="about-photo rv">
              <img src={anilImg} alt="Anil Jiragyale" />
            </div>
            <div>
              <p className="about-p rv">{SUMMARY}</p>
              {(about?.extraParagraphs || []).map((para, i) => (
                <p key={i} className={`about-p rv d${i + 1}`}>{para}</p>
              ))}

              <div className="rv d3" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <a href={resumeUrl} download={resumeFileName} className="btn-grd">
                  Download Resume <i className="fas fa-download" style={{ marginLeft: '4px' }} />
                </a>
              </div>

              <div className="tag-row rv d3">
                {(about?.tags || []).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sec-wrap alt">
        <div className="container" id="skills" style={{ paddingTop: '5rem' }}>
          <div className="eyebrow rv">Technical Arsenal</div>
          <h2 className="sec-title rv">My <span>Skills</span></h2>
          <p className="sec-sub rv">Skills aligned with my resume — languages, AI/ML, full stack, cloud, and data.</p>

          <div className="skills-grid">
            {SKILL_CATEGORIES.map((cat, i) => (
              <div key={cat.name} className={`skill-card rv d${Math.min(i, 4)}`}>
                <div className="sk-icon">{cat.icon}</div>
                <div className="sk-name">{cat.name}</div>
                <div className="sk-pills">
                  {cat.skills.slice(0, 6).map((s) => (
                    <span key={s} className="sk-pill">{s}</span>
                  ))}
                  {cat.skills.length > 6 && (
                    <span className="sk-pill">+{cat.skills.length - 6}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-wrap">
        <div className="container" id="experience">
          <div className="eyebrow rv">Career Timeline</div>
          <h2 className="sec-title rv">Professional <span>Journey</span></h2>

          <div className="timeline">
            {EXPERIENCE.map((job, i) => (
              <div key={job.id} className="tl-item">
                <div className={`tl-dot ${job.current ? 'current' : 'past'}`}>
                  {job.current && <span>●</span>}
                </div>
                <div className={`tl-card ${job.current ? 'active' : ''} rv ${i > 0 ? `d${Math.min(i, 4)}` : ''}`}>
                  {job.current && (
                    <div className="cur-badge">
                      <span className="blink-sm" /> Currently
                    </div>
                  )}
                  <div className="tl-top">
                    <div>
                      <div className="tl-co">{job.title}</div>
                      <div className="tl-role">{job.company} · {job.location}</div>
                      <div className="tl-loc">{job.type}</div>
                    </div>
                    <div className="tl-date"><span>{job.period}</span></div>
                  </div>
                  <ul className="tl-bullets">
                    {job.bullets.map((b) => (
                      <li key={b.slice(0, 40)}>{b}</li>
                    ))}
                  </ul>
                  <div className="tl-tags">
                    {job.tags.map((t) => (
                      <span key={t} className="svc-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-wrap alt">
        <div className="container" id="education">
          <div className="eyebrow rv">Learning &amp; Credentials</div>
          <h2 className="sec-title rv">Education &amp; <span>Certifications</span></h2>

          <div className="edu-cert-grid">
            <div>
              <p className="edu-section-label rv">Academic Background</p>
              <div className="edu-list">
                {EDUCATION.map((edu, i) => (
                  <div key={edu.degree} className={`edu-card rv ${i > 0 ? `d${Math.min(i, 3)}` : ''}`}>
                    <div className="edu-icon-wrap">{edu.icon}</div>
                    <div>
                      <div className="edu-deg">{edu.degree}</div>
                      <div className="edu-school">{edu.school}</div>
                      <div className="edu-meta">{edu.period} · {edu.location}</div>
                      <div className="edu-score">{edu.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="edu-section-label rv">Certifications</p>
              <div className="cert-list">
                {CERTIFICATIONS.map((cert, i) => (
                  <div key={cert.name} className={`cert-item rv ${i > 0 ? `d${Math.min(i, 3)}` : ''}`}>
                    <div className="cert-icon">🏅</div>
                    <div>
                      <div className="cert-name">{cert.name}</div>
                      <div className="cert-org">{cert.org} · {cert.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
