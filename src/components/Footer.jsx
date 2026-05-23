import { Link } from 'react-router-dom'

export default function Footer() {
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
          <div className="footer-brand">AJ.</div>
          <div className="footer-text">Full Stack AI Engineer · LLM &amp; RAG Systems · Bangalore, India</div>
          <div className="footer-text" style={{ marginTop: '4px' }}>
            © {year} Anil Channappa Jiragyale — Open to Opportunities
          </div>
        </div>
        <div className="footer-socials">
          <a href="mailto:aniljiragyale07@gmail.com" className="btn-sq" title="Email">
            <i className="fas fa-envelope" />
          </a>
          <a href="https://linkedin.com/in/anil-jiragyale" target="_blank" rel="noreferrer" className="btn-sq" title="LinkedIn">
            <i className="fab fa-linkedin-in" />
          </a>
          <a href="https://github.com/aniljiragyale" target="_blank" rel="noreferrer" className="btn-sq" title="GitHub">
            <i className="fab fa-github" />
          </a>
          <a href="tel:+919591585862" className="btn-sq" title="Phone">
            <i className="fas fa-phone" />
          </a>
        </div>
      </div>
    </footer>
  )
}
