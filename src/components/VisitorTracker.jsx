import { useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'
import { CONTACT as DEFAULT_CONTACT } from '../data/profile'

function getEmailJsConfig(contact = DEFAULT_CONTACT) {
  const emailjsCfg = contact?.emailjs ?? DEFAULT_CONTACT.emailjs
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || emailjsCfg.serviceId,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || emailjsCfg.templateId,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || emailjsCfg.publicKey,
  }
}

export default function VisitorTracker() {
  const { content } = useSiteContent()
  const location = useLocation()

  const CONTACT = {
    ...DEFAULT_CONTACT,
    ...content?.contact,
    emailjs: {
      ...DEFAULT_CONTACT.emailjs,
      ...content?.contact?.emailjs,
    },
  }

  const { serviceId, templateId, publicKey } = getEmailJsConfig(CONTACT)

  useEffect(() => {
    // Avoid triggering tracker on admin pages
    if (location.pathname.startsWith('/admin')) {
      return
    }

    // Check session storage to prevent multiple emails per session
    if (sessionStorage.getItem('portfolio_visit_notified') === 'true') {
      return
    }

    // Set notified immediately to avoid duplicate trigger/race conditions
    sessionStorage.setItem('portfolio_visit_notified', 'true')

    const triggerNotification = async () => {
      let ipString = 'Unknown / Could not resolve IP location details'
      try {
        const res = await fetch('https://ipapi.co/json/')
        if (res.ok) {
          const data = await res.json()
          ipString = `IP: ${data.ip || 'N/A'}\nCity: ${data.city || 'N/A'}\nRegion: ${data.region || 'N/A'}\nCountry: ${data.country_name || 'N/A'}\nISP: ${data.org || 'N/A'}`
        }
      } catch (err) {
        console.warn('VisitorTracker: Failed to fetch geolocation info', err)
      }

      const templateParams = {
        name: 'Portfolio Visitor Alert',
        email: 'visitor-tracker@jiragyale.com',
        subject: `New Portfolio Visit Alert — ${new Date().toLocaleDateString()}`,
        message: `Hello Anil,

A new user is visiting your portfolio!

--- Visitor Details ---
Time: ${new Date().toLocaleString()}
Page Landed: ${window.location.origin}${location.pathname}${location.search}
Referrer: ${document.referrer || 'Direct / Bookmark'}
User Agent: ${navigator.userAgent}

--- Location Info ---
${ipString}`,
        to_email: CONTACT.email,
      }

      try {
        if (publicKey) {
          emailjs.init({ publicKey })
        }
        await emailjs.send(serviceId, templateId, templateParams, { publicKey })
        console.log('Visitor notification email sent successfully.')
      } catch (sdkError) {
        console.warn('VisitorTracker: EmailJS SDK failed, trying REST API...', sdkError)
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
          })
          if (res.ok) {
            console.log('Visitor notification email sent successfully via REST API.')
          } else {
            console.warn('VisitorTracker: EmailJS REST API response not OK')
          }
        } catch (apiError) {
          console.error('VisitorTracker: EmailJS REST API request failed', apiError)
        }
      }
    }

    triggerNotification()
  }, [location.pathname, location.search, serviceId, templateId, publicKey, CONTACT.email])

  return null
}
