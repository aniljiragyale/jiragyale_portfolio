import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import PageBack from '../components/PageBack'
import useScrollReveal from '../hooks/useScrollReveal'
import { useSiteContent } from '../context/SiteContentContext'
import { submitMessage } from '../utils/portfolioApi'
import { CONTACT as DEFAULT_CONTACT } from '../data/profile'

function getEmailJsConfig(contact = DEFAULT_CONTACT) {
  const emailjsCfg = contact?.emailjs ?? DEFAULT_CONTACT.emailjs
  return {
    serviceId:
      import.meta.env.VITE_EMAILJS_SERVICE_ID || emailjsCfg.serviceId,
    templateId:
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || emailjsCfg.templateId,
    publicKey:
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || emailjsCfg.publicKey,
  }
}

export default function Contact() {
  const { content } = useSiteContent()
  const CONTACT = content.contact
  const pageRef = useScrollReveal()
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState({
    submitting: false,
    text: '',
    type: '',
  })

  const { serviceId, templateId, publicKey } = getEmailJsConfig(CONTACT)

  useEffect(() => {
    if (publicKey) {
      emailjs.init({ publicKey })
    }
  }, [publicKey])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const saveToAdmin = async (payload) => {
    await submitMessage(payload)
  }

  const sendViaApi = async (payload) => {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: payload,
      }),
    })
    if (!res.ok) throw new Error('EmailJS API failed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, email, subject, message } = formData
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ submitting: false, text: 'Please fill in name, email, and message.', type: 'error' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus({ submitting: false, text: 'Please enter a valid email address.', type: 'error' })
      return
    }

    setStatus({ submitting: true, text: 'Sending...', type: '' })

    const subjectLine = subject.trim() || 'Portfolio Contact Form'
    const fullMessage = `Subject: ${subjectLine}\n\n${message.trim()}`
    const templateParams = {
      name: name.trim(),
      email: email.trim(),
      message: fullMessage,
      subject: subjectLine,
      to_email: CONTACT.email,
    }

    try {
      await emailjs.send(serviceId, templateId, templateParams, { publicKey })
      await saveToAdmin({ name, email, subject: subjectLine, message })
      setStatus({
        submitting: false,
        text: 'Thank you! Message sent successfully — I will reply to your email soon.',
        type: 'success',
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (sdkError) {
      console.warn('EmailJS SDK failed, trying REST API...', sdkError)
      try {
        await sendViaApi(templateParams)
        await saveToAdmin({ name, email, subject: subjectLine, message })
        setStatus({
          submitting: false,
          text: 'Thank you! Message sent successfully — I will reply to your email soon.',
          type: 'success',
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } catch (apiError) {
        console.error('EmailJS Error:', apiError)
        setStatus({
          submitting: false,
          text: `Failed to send. Please email me directly at ${CONTACT.email}`,
          type: 'error',
        })
      }
    }
  }

  const mailtoLink = `mailto:${CONTACT.email}?subject=${encodeURIComponent(formData.subject || 'Portfolio inquiry')}&body=${encodeURIComponent(
    `Hi Anil,\n\n${formData.message || ''}\n\n— ${formData.name || 'Your name'}\n${formData.email || ''}`
  )}`

  return (
    <div ref={pageRef}>
      <div className="sec-wrap">
        <div className="container page-hero-wrap" id="contact">
          <PageBack />
          <div className="eyebrow rv on">Let's Connect</div>
          <h1 className="sec-title rv on">Get In <span>Touch</span></h1>

          <div className="contact-grid">
            <div className="rv on">
              <p className="contact-intro">
                Actively seeking full-time roles in <strong>AI Engineering</strong>, <strong>Full Stack Development</strong>, and product-driven companies. Based in {CONTACT.location}.
              </p>
              <div className="clinks">
                <a href={`mailto:${CONTACT.email}`} className="clink">
                  <div className="clink-ico blue"><i className="fas fa-envelope" /></div>
                  <div>
                    <div className="clink-lbl">Email</div>
                    <div className="clink-val">{CONTACT.email}</div>
                  </div>
                </a>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="clink">
                  <div className="clink-ico teal"><i className="fas fa-phone" /></div>
                  <div>
                    <div className="clink-lbl">Phone</div>
                    <div className="clink-val">{CONTACT.phone}</div>
                  </div>
                </a>
                <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="clink">
                  <div className="clink-ico blue"><i className="fab fa-linkedin-in" /></div>
                  <div>
                    <div className="clink-lbl">LinkedIn</div>
                    <div className="clink-val">linkedin.com/in/anil-jiragyale</div>
                  </div>
                </a>
                <a href={CONTACT.github} target="_blank" rel="noreferrer" className="clink">
                  <div className="clink-ico teal"><i className="fab fa-github" /></div>
                  <div>
                    <div className="clink-lbl">GitHub</div>
                    <div className="clink-val">github.com/aniljiragyale</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="rv d1 on">
              <div className="contact-form-card">
                <form ref={formRef} id="contactForm" className="contact-form" onSubmit={handleSubmit}>
                  <div>
                    <label className="fl" htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="fi"
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="fl" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="fi"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="fl" htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="fi"
                      placeholder="Job Opportunity / Collaboration"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="fl" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="ft"
                      placeholder="Tell me about your project or opportunity..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {status.text && (
                    <div className={`form-msg ${status.type} show`}>{status.text}</div>
                  )}
                  <button type="submit" className="fsub" disabled={status.submitting}>
                    {status.submitting ? 'Sending...' : 'Send Message ✦'}
                  </button>
                  <a href={mailtoLink} className="btn-ghost contact-mailto-btn">
                    <i className="fas fa-envelope" /> Or open in email app
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
