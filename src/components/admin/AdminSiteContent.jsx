import { useState } from 'react'
import { useSiteContent } from '../../context/SiteContentContext'
import { readResumeFileAsDataUrl } from '../../utils/siteContentStorage'
import {
  newListId,
  EMPTY_EXPERIENCE,
  EMPTY_SKILL_CATEGORY,
  EMPTY_EDUCATION,
  EMPTY_CERTIFICATION,
  EMPTY_PROJECT,
  EMPTY_SERVICE,
  EMPTY_TESTIMONIAL,
  EMPTY_METRIC,
} from '../../utils/adminContentTemplates'

function Field({ label, children }) {
  return (
    <div className="admin-field">
      <label className="fl">{label}</label>
      {children}
    </div>
  )
}

function SectionHeader({ icon, title, onAdd, addLabel = 'Add item' }) {
  return (
    <div className="admin-section-header">
      <h3 className="admin-content-heading">
        <i className={icon} /> {title}
      </h3>
      {onAdd && (
        <button type="button" className="admin-add-btn" onClick={onAdd} title={addLabel} aria-label={addLabel}>
          <i className="fas fa-plus" />
        </button>
      )}
    </div>
  )
}

function ItemCard({ indexLabel, onRemove, children }) {
  return (
    <article className="admin-edit-card">
      <header className="admin-edit-card-head">
        <span className="admin-edit-card-title">{indexLabel}</span>
        {onRemove && (
          <button type="button" className="admin-remove-btn" onClick={onRemove} title="Remove" aria-label="Remove">
            <i className="fas fa-trash" />
          </button>
        )}
      </header>
      {children}
    </article>
  )
}

export default function AdminSiteContent() {
  const { content, replaceContent, resetContent, resumeUrl, resumeFileName, reload } =
    useSiteContent()
  const [saved, setSaved] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)

  const flashSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const patch = (partial) => {
    replaceContent({ ...content, ...partial })
    flashSaved()
  }

  const patchHome = (partial) => {
    patch({ home: { ...content.home, ...partial } })
  }

  const patchAbout = (partial) => {
    patch({ about: { ...content.about, ...partial } })
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const dataUrl = await readResumeFileAsDataUrl(file)
      replaceContent({
        ...content,
        resume: {
          ...content.resume,
          dataUrl,
          fileName: file.name || 'resume.pdf',
        },
      })
      flashSaved()
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const clearResume = () => {
    replaceContent({
      ...content,
      resume: { ...content.resume, dataUrl: null },
    })
    flashSaved()
  }

  const updateContact = (key, value) => {
    patch({ contact: { ...content.contact, [key]: value } })
  }

  const updateExperience = (index, field, value) => {
    const experience = content.experience.map((job, i) =>
      i === index ? { ...job, [field]: value } : job
    )
    patch({ experience })
  }

  const addExperience = () => {
    patch({
      experience: [
        ...content.experience,
        { ...EMPTY_EXPERIENCE, id: newListId('exp') },
      ],
    })
  }

  const removeExperience = (index) => {
    if (!window.confirm('Remove this experience entry?')) return
    patch({ experience: content.experience.filter((_, i) => i !== index) })
  }

  const updateSkillCategory = (index, field, value) => {
    const skillCategories = content.skillCategories.map((cat, i) =>
      i === index ? { ...cat, [field]: value } : cat
    )
    patch({ skillCategories })
  }

  const updateSkillList = (catIndex, text) => {
    const skills = text.split(',').map((s) => s.trim()).filter(Boolean)
    const skillCategories = content.skillCategories.map((cat, i) =>
      i === catIndex ? { ...cat, skills } : cat
    )
    patch({ skillCategories })
  }

  const addSkillCategory = () => {
    patch({
      skillCategories: [...content.skillCategories, { ...EMPTY_SKILL_CATEGORY }],
    })
  }

  const removeSkillCategory = (index) => {
    if (!window.confirm('Remove this skill category?')) return
    patch({ skillCategories: content.skillCategories.filter((_, i) => i !== index) })
  }

  const updateEducation = (index, field, value) => {
    const education = content.education.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    patch({ education })
  }

  const addEducation = () => {
    patch({ education: [...content.education, { ...EMPTY_EDUCATION }] })
  }

  const removeEducation = (index) => {
    if (!window.confirm('Remove this education entry?')) return
    patch({ education: content.education.filter((_, i) => i !== index) })
  }

  const updateCertification = (index, field, value) => {
    const certifications = content.certifications.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    patch({ certifications })
  }

  const addCertification = () => {
    patch({ certifications: [...content.certifications, { ...EMPTY_CERTIFICATION }] })
  }

  const removeCertification = (index) => {
    if (!window.confirm('Remove this certification?')) return
    patch({ certifications: content.certifications.filter((_, i) => i !== index) })
  }

  const updateProject = (index, field, value) => {
    const projects = content.projects.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    )
    patch({ projects })
  }

  const updateProjectTags = (index, text) => {
    const tags = text.split(',').map((s) => s.trim()).filter(Boolean)
    const projects = content.projects.map((p, i) => (i === index ? { ...p, tags } : p))
    patch({ projects })
  }

  const addProject = () => {
    patch({
      projects: [
        ...content.projects,
        { ...EMPTY_PROJECT, id: newListId('project') },
      ],
    })
  }

  const removeProject = (index) => {
    if (!window.confirm('Remove this project?')) return
    patch({ projects: content.projects.filter((_, i) => i !== index) })
  }

  const updateHomeList = (key, index, field, value) => {
    const list = (content.home?.[key] || []).map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    patchHome({ [key]: list })
  }

  const addHomeListItem = (key, emptyItem) => {
    patchHome({ [key]: [...(content.home?.[key] || []), { ...emptyItem }] })
  }

  const removeHomeListItem = (key, index, label) => {
    if (!window.confirm(`Remove this ${label}?`)) return
    patchHome({ [key]: (content.home?.[key] || []).filter((_, i) => i !== index) })
  }

  const updateServiceTags = (index, text) => {
    const tags = text.split(',').map((s) => s.trim()).filter(Boolean)
    const services = content.home.services.map((s, i) => (i === index ? { ...s, tags } : s))
    patchHome({ services })
  }

  const updateAboutParagraph = (index, value) => {
    const extraParagraphs = content.about.extraParagraphs.map((p, i) =>
      i === index ? value : p
    )
    patchAbout({ extraParagraphs })
  }

  const addAboutParagraph = () => {
    patchAbout({
      extraParagraphs: [...(content.about?.extraParagraphs || []), 'New paragraph text.'],
    })
  }

  const removeAboutParagraph = (index) => {
    if (!window.confirm('Remove this paragraph?')) return
    patchAbout({
      extraParagraphs: content.about.extraParagraphs.filter((_, i) => i !== index),
    })
  }

  const updateAboutTag = (index, value) => {
    const tags = content.about.tags.map((t, i) => (i === index ? value : t))
    patchAbout({ tags })
  }

  const addAboutTag = () => {
    patchAbout({ tags: [...(content.about?.tags || []), 'New tag'] })
  }

  const removeAboutTag = (index) => {
    patchAbout({ tags: content.about.tags.filter((_, i) => i !== index) })
  }

  return (
    <div className="admin-content-editor">
      {saved && (
        <div className="form-msg success show admin-save-toast">
          Saved — refresh the site pages to see updates everywhere on this browser.
        </div>
      )}

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-file-pdf" title="Resume" />
        <p className="admin-content-hint">
          Upload a new PDF — download links on Home, About, and Chatbot update immediately.
        </p>
        {uploadError && <div className="form-msg error show">{uploadError}</div>}
        <div className="admin-resume-actions">
          <label className="btn-grd admin-upload-btn">
            {uploading ? 'Uploading…' : 'Upload new resume (PDF)'}
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeUpload}
              disabled={uploading}
              hidden
            />
          </label>
          {content.resume?.dataUrl && (
            <button type="button" className="btn-ghost admin-btn-sm" onClick={clearResume}>
              Use default resume
            </button>
          )}
          <a href={resumeUrl} download={resumeFileName} className="btn-ghost admin-btn-sm" target="_blank" rel="noreferrer">
            Preview current resume ↗
          </a>
        </div>
        <p className="admin-content-meta">
          Current file: <strong>{resumeFileName}</strong>
          {content.resume?.dataUrl ? ' (custom upload)' : ' (bundled default)'}
        </p>
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-user" title="Profile & contact" />
        <div className="admin-content-grid">
          <Field label="Full name">
            <input className="fi admin-fi" value={content.contact.name} onChange={(e) => updateContact('name', e.target.value)} />
          </Field>
          <Field label="Title">
            <input className="fi admin-fi" value={content.contact.title} onChange={(e) => updateContact('title', e.target.value)} />
          </Field>
          <Field label="Tagline">
            <input className="fi admin-fi" value={content.contact.tagline} onChange={(e) => updateContact('tagline', e.target.value)} />
          </Field>
          <Field label="Email">
            <input className="fi admin-fi" type="email" value={content.contact.email} onChange={(e) => updateContact('email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className="fi admin-fi" value={content.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} />
          </Field>
          <Field label="Location">
            <input className="fi admin-fi" value={content.contact.location} onChange={(e) => updateContact('location', e.target.value)} />
          </Field>
          <Field label="LinkedIn URL">
            <input className="fi admin-fi" value={content.contact.linkedin || ''} onChange={(e) => updateContact('linkedin', e.target.value)} />
          </Field>
          <Field label="GitHub URL">
            <input className="fi admin-fi" value={content.contact.github || ''} onChange={(e) => updateContact('github', e.target.value)} />
          </Field>
        </div>
        <Field label="Professional summary">
          <textarea
            className="ft admin-fi"
            rows={5}
            value={content.summary}
            onChange={(e) => patch({ summary: e.target.value })}
          />
        </Field>
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-code" title="Skills" onAdd={addSkillCategory} addLabel="Add skill category" />
        {content.skillCategories.map((cat, i) => (
          <ItemCard key={`skill-${i}-${cat.name}`} indexLabel={cat.name || `Category ${i + 1}`} onRemove={() => removeSkillCategory(i)}>
            <div className="admin-content-grid">
              <Field label="Category name">
                <input className="fi admin-fi" value={cat.name} onChange={(e) => updateSkillCategory(i, 'name', e.target.value)} />
              </Field>
              <Field label="Icon">
                <input className="fi admin-fi" value={cat.icon} onChange={(e) => updateSkillCategory(i, 'icon', e.target.value)} />
              </Field>
            </div>
            <Field label="Skills (comma-separated)">
              <input className="fi admin-fi" value={cat.skills.join(', ')} onChange={(e) => updateSkillList(i, e.target.value)} />
            </Field>
          </ItemCard>
        ))}
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-briefcase" title="Experience" onAdd={addExperience} addLabel="Add experience" />
        {content.experience.map((job, i) => (
          <ItemCard key={job.id || `exp-${i}`} indexLabel={job.company || `Experience ${i + 1}`} onRemove={() => removeExperience(i)}>
            <Field label="Job title">
              <input className="fi admin-fi" value={job.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} />
            </Field>
            <div className="admin-content-grid">
              <Field label="Company">
                <input className="fi admin-fi" value={job.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
              </Field>
              <Field label="Location">
                <input className="fi admin-fi" value={job.location || ''} onChange={(e) => updateExperience(i, 'location', e.target.value)} />
              </Field>
              <Field label="Period">
                <input className="fi admin-fi" value={job.period} onChange={(e) => updateExperience(i, 'period', e.target.value)} />
              </Field>
              <Field label="Type">
                <input className="fi admin-fi" value={job.type || ''} onChange={(e) => updateExperience(i, 'type', e.target.value)} />
              </Field>
            </div>
            <Field label="Tags (comma-separated)">
              <input
                className="fi admin-fi"
                value={(job.tags || []).join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  const experience = content.experience.map((j, idx) =>
                    idx === i ? { ...j, tags } : j
                  )
                  patch({ experience })
                }}
              />
            </Field>
            <Field label="Bullet points (one per line)">
              <textarea
                className="ft admin-fi"
                rows={4}
                value={(job.bullets || []).join('\n')}
                onChange={(e) => {
                  const bullets = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean)
                  const experience = content.experience.map((j, idx) =>
                    idx === i ? { ...j, bullets } : j
                  )
                  patch({ experience })
                }}
              />
            </Field>
          </ItemCard>
        ))}
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-graduation-cap" title="Education" onAdd={addEducation} addLabel="Add education" />
        {content.education.map((edu, i) => (
          <ItemCard key={`edu-${i}`} indexLabel={edu.school || `Education ${i + 1}`} onRemove={() => removeEducation(i)}>
            <Field label="Degree">
              <input className="fi admin-fi" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
            </Field>
            <div className="admin-content-grid">
              <Field label="School">
                <input className="fi admin-fi" value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} />
              </Field>
              <Field label="Location">
                <input className="fi admin-fi" value={edu.location || ''} onChange={(e) => updateEducation(i, 'location', e.target.value)} />
              </Field>
              <Field label="Period">
                <input className="fi admin-fi" value={edu.period} onChange={(e) => updateEducation(i, 'period', e.target.value)} />
              </Field>
              <Field label="Score">
                <input className="fi admin-fi" value={edu.score || ''} onChange={(e) => updateEducation(i, 'score', e.target.value)} />
              </Field>
              <Field label="Icon">
                <input className="fi admin-fi" value={edu.icon || ''} onChange={(e) => updateEducation(i, 'icon', e.target.value)} />
              </Field>
            </div>
          </ItemCard>
        ))}
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-certificate" title="Certifications" onAdd={addCertification} addLabel="Add certification" />
        {content.certifications.map((cert, i) => (
          <ItemCard key={`cert-${i}`} indexLabel={cert.name || `Certification ${i + 1}`} onRemove={() => removeCertification(i)}>
            <div className="admin-content-grid">
              <Field label="Name">
                <input className="fi admin-fi" value={cert.name} onChange={(e) => updateCertification(i, 'name', e.target.value)} />
              </Field>
              <Field label="Organization">
                <input className="fi admin-fi" value={cert.org} onChange={(e) => updateCertification(i, 'org', e.target.value)} />
              </Field>
              <Field label="Date">
                <input className="fi admin-fi" value={cert.date} onChange={(e) => updateCertification(i, 'date', e.target.value)} />
              </Field>
            </div>
          </ItemCard>
        ))}
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-folder-open" title="Projects" onAdd={addProject} addLabel="Add project" />
        <p className="admin-content-hint">Featured projects appear on the home page. View Details opens /projects/your-id.</p>
        {content.projects.map((proj, i) => (
          <ItemCard key={proj.id || `proj-${i}`} indexLabel={proj.title || `Project ${i + 1}`} onRemove={() => removeProject(i)}>
            <div className="admin-content-grid">
              <Field label="URL slug (id)">
                <input className="fi admin-fi" value={proj.id} onChange={(e) => updateProject(i, 'id', e.target.value)} />
              </Field>
              <Field label="Title">
                <input className="fi admin-fi" value={proj.title} onChange={(e) => updateProject(i, 'title', e.target.value)} />
              </Field>
              <Field label="Category">
                <input className="fi admin-fi" value={proj.cat} onChange={(e) => updateProject(i, 'cat', e.target.value)} />
              </Field>
              <Field label="Badge label">
                <input className="fi admin-fi" value={proj.badge} onChange={(e) => updateProject(i, 'badge', e.target.value)} />
              </Field>
              <Field label="GitHub / external link">
                <input className="fi admin-fi" value={proj.link || ''} onChange={(e) => updateProject(i, 'link', e.target.value)} />
              </Field>
              <Field label="Image URL">
                <input className="fi admin-fi" value={proj.img || ''} onChange={(e) => updateProject(i, 'img', e.target.value)} />
              </Field>
            </div>
            <Field label="Short description">
              <textarea className="ft admin-fi" rows={3} value={proj.desc} onChange={(e) => updateProject(i, 'desc', e.target.value)} />
            </Field>
            <Field label="Tags (comma-separated)">
              <input className="fi admin-fi" value={(proj.tags || []).join(', ')} onChange={(e) => updateProjectTags(i, e.target.value)} />
            </Field>
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={!!proj.featured}
                onChange={(e) => updateProject(i, 'featured', e.target.checked)}
              />
              Show on home page (featured)
            </label>
          </ItemCard>
        ))}
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-home" title="Home page" />
        <Field label="Hero status badge">
          <input
            className="fi admin-fi"
            value={content.home?.heroStatus || ''}
            onChange={(e) => patchHome({ heroStatus: e.target.value })}
          />
        </Field>
        <div className="admin-content-grid">
          <Field label="Photo card 1 — title">
            <input
              className="fi admin-fi"
              value={content.home?.photoCard1?.big || ''}
              onChange={(e) => patchHome({ photoCard1: { ...content.home.photoCard1, big: e.target.value } })}
            />
          </Field>
          <Field label="Photo card 1 — subtitle">
            <input
              className="fi admin-fi"
              value={content.home?.photoCard1?.sm || ''}
              onChange={(e) => patchHome({ photoCard1: { ...content.home.photoCard1, sm: e.target.value } })}
            />
          </Field>
          <Field label="Photo card 2 — title">
            <input
              className="fi admin-fi"
              value={content.home?.photoCard2?.big || ''}
              onChange={(e) => patchHome({ photoCard2: { ...content.home.photoCard2, big: e.target.value } })}
            />
          </Field>
          <Field label="Photo card 2 — subtitle">
            <input
              className="fi admin-fi"
              value={content.home?.photoCard2?.sm || ''}
              onChange={(e) => patchHome({ photoCard2: { ...content.home.photoCard2, sm: e.target.value } })}
            />
          </Field>
        </div>
        <Field label="CTA title">
          <input className="fi admin-fi" value={content.home?.ctaTitle || ''} onChange={(e) => patchHome({ ctaTitle: e.target.value })} />
        </Field>
        <Field label="CTA text">
          <textarea className="ft admin-fi" rows={2} value={content.home?.ctaText || ''} onChange={(e) => patchHome({ ctaText: e.target.value })} />
        </Field>

        <SectionHeader
          icon="fas fa-chart-bar"
          title="Hero metrics"
          onAdd={() => addHomeListItem('metrics', EMPTY_METRIC)}
          addLabel="Add metric"
        />
        {(content.home?.metrics || []).map((m, i) => (
          <ItemCard key={`metric-${i}`} indexLabel={m.l || `Metric ${i + 1}`} onRemove={() => removeHomeListItem('metrics', i, 'metric')}>
            <div className="admin-content-grid">
              <Field label="Number">
                <input className="fi admin-fi" value={m.n} onChange={(e) => updateHomeList('metrics', i, 'n', e.target.value)} />
              </Field>
              <Field label="Label">
                <input className="fi admin-fi" value={m.l} onChange={(e) => updateHomeList('metrics', i, 'l', e.target.value)} />
              </Field>
            </div>
          </ItemCard>
        ))}

        <SectionHeader
          icon="fas fa-chart-line"
          title="Stats bar"
          onAdd={() => addHomeListItem('statsBar', EMPTY_METRIC)}
          addLabel="Add stat"
        />
        {(content.home?.statsBar || []).map((m, i) => (
          <ItemCard key={`stat-${i}`} indexLabel={m.l || `Stat ${i + 1}`} onRemove={() => removeHomeListItem('statsBar', i, 'stat')}>
            <div className="admin-content-grid">
              <Field label="Number">
                <input className="fi admin-fi" value={m.n} onChange={(e) => updateHomeList('statsBar', i, 'n', e.target.value)} />
              </Field>
              <Field label="Label">
                <input className="fi admin-fi" value={m.l} onChange={(e) => updateHomeList('statsBar', i, 'l', e.target.value)} />
              </Field>
            </div>
          </ItemCard>
        ))}

        <SectionHeader
          icon="fas fa-cubes"
          title="Services (What I Do)"
          onAdd={() => addHomeListItem('services', EMPTY_SERVICE)}
          addLabel="Add service"
        />
        {(content.home?.services || []).map((s, i) => (
          <ItemCard key={`service-${i}`} indexLabel={s.title || `Service ${i + 1}`} onRemove={() => removeHomeListItem('services', i, 'service')}>
            <div className="admin-content-grid">
              <Field label="Icon">
                <input className="fi admin-fi" value={s.icon} onChange={(e) => updateHomeList('services', i, 'icon', e.target.value)} />
              </Field>
              <Field label="Style class (purple / gold)">
                <input className="fi admin-fi" value={s.cls || ''} onChange={(e) => updateHomeList('services', i, 'cls', e.target.value)} />
              </Field>
              <Field label="Title">
                <input className="fi admin-fi" value={s.title} onChange={(e) => updateHomeList('services', i, 'title', e.target.value)} />
              </Field>
            </div>
            <Field label="Description">
              <textarea className="ft admin-fi" rows={3} value={s.desc} onChange={(e) => updateHomeList('services', i, 'desc', e.target.value)} />
            </Field>
            <Field label="Tags (comma-separated)">
              <input className="fi admin-fi" value={(s.tags || []).join(', ')} onChange={(e) => updateServiceTags(i, e.target.value)} />
            </Field>
          </ItemCard>
        ))}

        <SectionHeader
          icon="fas fa-quote-left"
          title="Testimonials"
          onAdd={() => addHomeListItem('testimonials', EMPTY_TESTIMONIAL)}
          addLabel="Add testimonial"
        />
        {(content.home?.testimonials || []).map((t, i) => (
          <ItemCard key={`test-${i}`} indexLabel={t.name || `Testimonial ${i + 1}`} onRemove={() => removeHomeListItem('testimonials', i, 'testimonial')}>
            <Field label="Quote">
              <textarea className="ft admin-fi" rows={3} value={t.text} onChange={(e) => updateHomeList('testimonials', i, 'text', e.target.value)} />
            </Field>
            <div className="admin-content-grid">
              <Field label="Name">
                <input className="fi admin-fi" value={t.name} onChange={(e) => updateHomeList('testimonials', i, 'name', e.target.value)} />
              </Field>
              <Field label="Role">
                <input className="fi admin-fi" value={t.role} onChange={(e) => updateHomeList('testimonials', i, 'role', e.target.value)} />
              </Field>
              <Field label="Initials">
                <input className="fi admin-fi" value={t.initials} onChange={(e) => updateHomeList('testimonials', i, 'initials', e.target.value)} />
              </Field>
            </div>
          </ItemCard>
        ))}
      </section>

      <section className="admin-content-section">
        <SectionHeader icon="fas fa-info-circle" title="About page" />
        <SectionHeader
          icon="fas fa-paragraph"
          title="Extra paragraphs"
          onAdd={addAboutParagraph}
          addLabel="Add paragraph"
        />
        {(content.about?.extraParagraphs || []).map((para, i) => (
          <ItemCard key={`about-p-${i}`} indexLabel={`Paragraph ${i + 1}`} onRemove={() => removeAboutParagraph(i)}>
            <textarea className="ft admin-fi" rows={3} value={para} onChange={(e) => updateAboutParagraph(i, e.target.value)} />
          </ItemCard>
        ))}
        <SectionHeader icon="fas fa-tags" title="About tags" onAdd={addAboutTag} addLabel="Add tag" />
        {(content.about?.tags || []).map((tag, i) => (
          <ItemCard key={`about-tag-${i}`} indexLabel={`Tag ${i + 1}`} onRemove={() => removeAboutTag(i)}>
            <input className="fi admin-fi" value={tag} onChange={(e) => updateAboutTag(i, e.target.value)} />
          </ItemCard>
        ))}
      </section>

      <div className="admin-panel-actions">
        <button type="button" className="btn-ghost admin-btn-sm" onClick={() => reload()}>
          Reload from storage
        </button>
        <button
          type="button"
          className="btn-ghost admin-btn-sm admin-btn-danger"
          onClick={() => {
            if (window.confirm('Reset all site content to defaults? This cannot be undone.')) {
              resetContent()
              flashSaved()
            }
          }}
        >
          Reset all to defaults
        </button>
      </div>
    </div>
  )
}
