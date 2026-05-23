import { useEffect, useRef, useState } from 'react'
import { useSiteContent } from '../context/SiteContentContext'

export default function SkillsShowcase() {
  const { content } = useSiteContent()
  const SKILL_CATEGORIES = content.skillCategories
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`skills-showcase rv ${visible ? 'on' : ''}`}>
      <div className="skills-showcase-header">
        <div className="skills-showcase-icon">
          <i className="fas fa-terminal" />
        </div>
        <div>
          <div className="skills-showcase-title">Technical stack</div>
          <div className="skills-showcase-sub">From resume · AI, full stack, cloud &amp; data</div>
        </div>
        <div className="skills-showcase-badge">
          <span className="blink-sm" />
          {SKILL_CATEGORIES.length} categories
        </div>
      </div>

      <div className="skills-showcase-grid">
        {SKILL_CATEGORIES.map((cat, i) => (
          <div
            key={cat.name}
            className="skills-showcase-card"
            style={{ animationDelay: visible ? `${i * 0.06}s` : '0s' }}
          >
            <div className="skills-showcase-card-head">
              <span className="skills-showcase-emoji">{cat.icon}</span>
              <span className="skills-showcase-cat">{cat.name}</span>
            </div>
            <div className="skills-showcase-pills">
              {cat.skills.map((skill) => (
                <span key={skill} className="skills-showcase-pill">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
