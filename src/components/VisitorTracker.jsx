import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { CONTACT as DEFAULT_CONTACT } from '../data/profile';
import './VisitorTracker.css';

function getEmailJsConfig(contact = DEFAULT_CONTACT) {
  const emailjsCfg = contact?.emailjs ?? DEFAULT_CONTACT.emailjs;
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || emailjsCfg.serviceId,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || emailjsCfg.templateId,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || emailjsCfg.publicKey,
  };
}

/** Fetch IP-based location (silent, city-level, no GPS permission needed). */
async function getIpLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error();
    const d = await res.json();
    return {
      ip: d.ip || 'N/A',
      city: d.city || 'N/A',
      region: d.region || 'N/A',
      country: d.country_name || 'N/A',
      postal: d.postal || 'N/A',
      isp: d.org || 'N/A',
      latitude: d.latitude,
      longitude: d.longitude,
    };
  } catch {
    return null;
  }
}

/** Build the location section of the email. */
async function buildLocationString() {
  const ip = await getIpLocation();
  if (ip) {
    const mapsQuery = ip.latitude && ip.longitude
      ? `https://maps.google.com/?q=${ip.latitude},${ip.longitude}`
      : `https://maps.google.com/?q=${encodeURIComponent(ip.city + ', ' + ip.country)}`;

    return (
      `📍 LOCATION DETAILS (IP-Based — Silent Tracking)\n` +
      `   City/Region  : ${ip.city}, ${ip.region}\n` +
      `   Country      : ${ip.country}\n` +
      `   Postal/Pincode: ${ip.postal}\n` +
      `   IP Address   : ${ip.ip}\n` +
      `   ISP          : ${ip.isp}\n` +
      `   Maps Link    : ${mapsQuery}`
    );
  }

  return '📍 Location: Could not be determined (IP lookup failed)';
}

export default function VisitorTracker() {
  const { content } = useSiteContent();
  const location = useLocation();
  const inputRef = useRef(null);

  const CONTACT = {
    ...DEFAULT_CONTACT,
    ...content?.contact,
    emailjs: {
      ...DEFAULT_CONTACT.emailjs,
      ...content?.contact?.emailjs,
    },
  };

  const { serviceId, templateId, publicKey } = getEmailJsConfig(CONTACT);

  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(!sessionStorage.getItem('visitor_name'));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (showModal && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [showModal]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(false);
  };

  const handleSubmit = async (isSkip = false) => {
    if (submitting) return;
    const visitorName = isSkip ? 'Anonymous' : (name.trim() || 'Anonymous');
    sessionStorage.setItem('visitor_name', visitorName);
    setShowModal(false);

    if (sessionStorage.getItem('portfolio_visit_notified') === 'true') return;
    sessionStorage.setItem('portfolio_visit_notified', 'true');
    if (!serviceId || !templateId || !publicKey) return;

    setSubmitting(true);

    const locationString = await buildLocationString();

    const templateParams = {
      name: 'Portfolio Visitor Alert',
      email: 'visitor-tracker@jiragyale.com',
      subject: `🔔 ${visitorName} visited your profile — ${new Date().toLocaleDateString('en-IN')}`,
      message:
        `Hello Anil,\n\n` +
        `👋 ${visitorName} visited your portfolio!\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🕐 Time    : ${new Date().toLocaleString('en-IN')}\n` +
        `📄 Page    : ${window.location.origin}${location.pathname}${location.search}\n` +
        `🔗 Referrer: ${document.referrer || 'Direct / Bookmark'}\n` +
        `🖥️ Device  : ${navigator.userAgent}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${locationString}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `Cheers,\nPortfolio Tracker`,
      to_email: CONTACT.email,
      visitor_name: visitorName,
    };

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });
      if (res.ok) console.log('VisitorTracker: Email sent.');
      else console.warn('VisitorTracker: Email failed', await res.text());
    } catch (err) {
      console.warn('VisitorTracker: Email error', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="vt-overlay" role="dialog" aria-modal="true" aria-label="Welcome modal">
      <div className="vt-modal">

        {/* Gold header */}
        <div className="vt-header">
          <span className="vt-header-icon">👋</span>
          <span className="vt-header-title">Welcome!</span>
        </div>

        {/* White body */}
        <div className="vt-body">
          <p className="vt-greeting">Hi there!</p>
          <p className="vt-desc">
            You're visiting <strong>Anil's Portfolio</strong>.<br />
            Mind sharing your name so Anil knows who stopped by?
          </p>

          <div className="vt-input-wrap">
            <span className="vt-input-icon">✦</span>
            <input
              ref={inputRef}
              id="visitor-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name…"
              className="vt-input"
              maxLength={60}
              autoComplete="off"
            />
          </div>

          <button
            id="visitor-submit-btn"
            onClick={() => handleSubmit(false)}
            className="vt-btn"
            disabled={submitting}
          >
            {submitting ? 'Sending…' : 'Continue →'}
          </button>

          <p className="vt-skip" onClick={() => handleSubmit(true)}>
            Skip — continue anonymously
          </p>
        </div>

      </div>
    </div>
  );
}
