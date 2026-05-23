import { useState } from 'react'
import { useSiteContent } from '../../context/SiteContentContext'
import { readResumeFileAsDataUrl } from '../../utils/siteContentStorage'

function Field({ label, children }) {
  return (
    <div className="admin-field">
      <label className="fl">{label}</label>
      {children}
    </div>
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

  return (
    <div className="admin-content-editor">
      {saved && (
        <div className="form-msg success show admin-save-toast">
          Saved — refresh the site pages to see updates everywhere on this browser.
        </div>
      )}

      <section className="admin-content-section">
        <h3 className="admin-content-heading"><i className="fas fa-file-pdf" /> Resume</h3>
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
        <h3 className="admin-content-heading"><i className="fas fa-user" /> Profile &amp; contact</h3>
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
        <h3 className="admin-content-heading"><i className="fas fa-code" /> Skills</h3>
        {content.skillCategories.map((cat, i) => (
          <div key={cat.name + i} className="admin-edit-card">
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
          </div>
        ))}
      </section>

      <section className="admin-content-section">
        <h3 className="admin-content-heading"><i className="fas fa-briefcase" /> Experience</h3>
        {content.experience.map((job, i) => (
          <div key={job.id || i} className="admin-edit-card">
            <Field label="Job title">
              <input className="fi admin-fi" value={job.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} />
            </Field>
            <div className="admin-content-grid">
              <Field label="Company">
                <input className="fi admin-fi" value={job.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
              </Field>
              <Field label="Period">
                <input className="fi admin-fi" value={job.period} onChange={(e) => updateExperience(i, 'period', e.target.value)} />
              </Field>
            </div>
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
          </div>
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
