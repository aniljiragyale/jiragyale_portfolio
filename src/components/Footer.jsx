import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

export default function Footer() {
  const { content } = useSiteContent()
  const CONTACT = content.contact
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="footer-admin-bar">
        <div className="footer-admin-inner">
          <span className="footer-admin-label">
            <i className="fas fa-lock" /> Admin access
          </span>
          <Link to="/admin" className="footer-admin-link">
            Login to Admin Panel →
          </Link>
        </div>
      </div>

      <div className="footer-inner">
        <div>
          <div className="footer-brand footer-brand-full">{CONTACT.name}</div>
          <div className="footer-text">Full Stack AI Engineer · LLM &amp; RAG Systems · Bangalore, India</div>
          <div className="footer-text footer-copy" style={{ marginTop: '4px' }}>
            © {year} {CONTACT.name} — Open to Opportunities
          </div>
        </div>
        <div className="footer-socials">
          <a href={`mailto:${CONTACT.email}`} className="btn-sq" title="Email">
            <i className="fas fa-envelope" />
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="btn-sq" title="LinkedIn">
            <i className="fab fa-linkedin-in" />
          </a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className="btn-sq" title="GitHub">
            <i className="fab fa-github" />
          </a>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="btn-sq" title="Phone">
            <i className="fas fa-phone" />
          </a>
        </div>
      </div>
    </footer>
  )
}
