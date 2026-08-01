import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSiteContent } from '../context/SiteContentContext'
import { submitChat } from '../utils/portfolioApi'

const CHIPS = [
  { label: '💻 Skills', query: 'What are your core skills?' },
  { label: '💼 Experience', query: 'Tell me about your work experience' },
  { label: '🚀 Projects', query: 'Show me your key projects' },
  { label: '📞 Contact', query: 'How can I contact you?' },
]

function hasWord(q, word) {
  return new RegExp(`\\b${word}\\b`, 'i').test(q)
}

function renderInline(content, lineIndex) {
  const parts = []
  const regex = /(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index))
    }
    if (match[0].startsWith('**')) {
      parts.push(
        <strong key={`${lineIndex}-${match.index}`}>{match[0].slice(2, -2)}</strong>
      )
    } else {
      parts.push(
        <a key={`${lineIndex}-${match.index}`} href={match[3]} target="_blank" rel="noreferrer">
          {match[2]}
        </a>
      )
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex))
  }

  return parts.length > 0 ? parts : content
}

/** Renders bot text with bold, links, and ordered/unordered lists in document order. */
function renderMessageText(text) {
  const lines = text.split('\n')
  const blocks = []
  let listBuffer = []
  let listType = null

  const flushList = () => {
    if (!listBuffer.length) return
    const Tag = listType === 'ol' ? 'ol' : 'ul'
    blocks.push(
      <Tag key={`list-${blocks.length}`} className="chat-list">
        {listBuffer.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </Tag>
    )
    listBuffer = []
    listType = null
  }

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      return
    }

    const ordered = trimmed.match(/^(\d+)\.\s+(.*)$/)
    const bullet = trimmed.match(/^[-•]\s+(.*)$/)

    if (ordered) {
      if (listType && listType !== 'ol') flushList()
      listType = 'ol'
      listBuffer.push(renderInline(ordered[2], lineIndex))
      return
    }

    if (bullet) {
      if (listType && listType !== 'ul') flushList()
      listType = 'ul'
      listBuffer.push(renderInline(bullet[1], lineIndex))
      return
    }

    flushList()
    blocks.push(
      <p key={`line-${lineIndex}`} className="chat-line">
        {renderInline(trimmed, lineIndex)}
      </p>
    )
  })

  flushList()
  return blocks
}

function currentJob(EXPERIENCE = []) {
  const jobs = realExperience(EXPERIENCE)
  return jobs.find((j) => j.current) || jobs[0]
}

function isPlaceholderJob(job) {
  if (!job) return true
  const title = (job.title || '').trim()
  const company = (job.company || '').trim()
  const location = (job.location || '').trim()
  const bullets = Array.isArray(job.bullets) ? job.bullets.join(' ') : String(job.bullets || '')
  if (!title || !company) return true
  if (/job title/i.test(title)) return true
  if (/company name/i.test(company)) return true
  if (/^city,\s*country$/i.test(location)) return true
  if (/describe your impact/i.test(bullets)) return true
  return false
}

function realExperience(EXPERIENCE = []) {
  return EXPERIENCE.filter((job) => !isPlaceholderJob(job))
}

function formatExperience(EXPERIENCE = []) {
  const jobs = realExperience(EXPERIENCE)
  if (!jobs.length) return '• Experience details are listed on the About page.'

  // Use bold serials (not "1." markdown) so the renderer does not reset numbering
  return jobs
    .map((job, i) => {
      const highlight = job.bullets?.[0] ? `\n• ${job.bullets[0]}` : ''
      return `**${i + 1}.** **${job.title}** at **${job.company}**\n(${job.period})${highlight}`
    })
    .join('\n\n')
}

function getBotResponse(query, { CONTACT, EXPERIENCE, EDUCATION, CERTIFICATIONS, PROJECTS, resumeUrl }) {
  const q = query.toLowerCase().trim()
  const job = currentJob(EXPERIENCE)

  // Topic answers first — chips like "What are your core skills?" must not hit meta replies
  if (
    q.includes('skill') ||
    q.includes('technolog') ||
    q.includes('tech stack') ||
    hasWord(q, 'stack') ||
    (q.includes('lang') && !q.includes('language spoken'))
  ) {
    return `Anil is an **AI Engineer** with a strong full stack background. Key skills:

• **AI/ML**: LangChain, LangGraph, RAG, Milvus, LLM integration, NLP
• **Frontend**: React.js, Next.js, Tailwind CSS
• **Backend**: FastAPI, Node.js, Express.js, Spring Boot
• **Databases**: PostgreSQL, MySQL, MongoDB, Milvus
• **Cloud**: AWS, Azure App Service, Jenkins, CI/CD
• **Data**: Power BI, Pandas, TensorFlow, Scikit-learn`
  }

  if (
    q.includes('experience') ||
    q.includes('work history') ||
    q.includes('career') ||
    hasWord(q, 'job') ||
    hasWord(q, 'work') ||
    hasWord(q, 'rokkun') ||
    hasWord(q, 'gsk') ||
    q.includes('previous') ||
    q.includes('worked')
  ) {
    return `Here’s Anil’s work experience:\n\n${formatExperience(EXPERIENCE)}`
  }

  if (q.includes('project') || q.includes('portfolio') || (q.includes('built') && !q.includes('build something'))) {
    const list = (PROJECTS || [])
      .slice(0, 6)
      .map((p) => `• **${p.title}** — ${(p.desc || '').slice(0, 100)}${(p.desc || '').length > 100 ? '…' : ''}`)
      .join('\n')
    return `Key projects from Anil’s portfolio:\n\n${list || '• Projects are listed on the Projects page of this site.'}`
  }

  if (q.includes('resume') || hasWord(q, 'cv') || q.includes('download resume')) {
    return `You can download Anil’s resume here:

👉 **[Download Resume PDF](${resumeUrl})**`
  }

  // Separate contact channels — "linked in" (with space) must match too
  const wantsLinkedIn =
    q.includes('linkedin') ||
    q.includes('linked in') ||
    q.includes('linked-in') ||
    (q.includes('linked') && q.includes('profile'))
  const wantsGithub = q.includes('github') || q.includes('git hub')
  const wantsEmail = q.includes('email') || q.includes('mail id') || q.includes('e-mail')
  const wantsPhone =
    q.includes('phone') ||
    q.includes('mobile') ||
    hasWord(q, 'call') ||
    q.includes('whatsapp') ||
    (hasWord(q, 'number') && (q.includes('phone') || q.includes('mobile') || q.includes('contact')))
  const wantsContact =
    q.includes('contact') ||
    q.includes('hire') ||
    q.includes('reach') ||
    q.includes('connect') ||
    q.includes('get in touch') ||
    (q.includes('send') && (q.includes('details') || q.includes('info')))

  // Prefer a single channel when the user asks for one specifically
  if (wantsLinkedIn) {
    return `Here’s Anil’s LinkedIn profile:

👉 **[Open LinkedIn](${CONTACT.linkedin})**

${CONTACT.linkedin}`
  }

  if (wantsGithub) {
    return `Here’s Anil’s GitHub profile:

👉 **[Open GitHub](${CONTACT.github})**

${CONTACT.github}`
  }

  if (wantsEmail && !wantsPhone && !wantsContact) {
    return `Here’s Anil’s email:

📧 **[${CONTACT.email}](mailto:${CONTACT.email})**

Or open the contact page to send a message: **[Send a message](/contact)**`
  }

  if (wantsPhone && !wantsEmail && !wantsContact) {
    return `Here’s Anil’s phone number:

📞 **${CONTACT.phone}**

Or open the contact page to send a message: **[Send a message](/contact)**`
  }

  if (
    wantsContact ||
    wantsEmail ||
    wantsPhone ||
    q.includes('message') ||
    q.includes('send a message') ||
    q.includes('contact page') ||
    q.includes('get in touch')
  ) {
    return `Connect with **${CONTACT.name}**:

• 📧 [${CONTACT.email}](mailto:${CONTACT.email})
• 📞 **${CONTACT.phone}**
• 💼 [LinkedIn](${CONTACT.linkedin})
• 💻 [GitHub](${CONTACT.github})
• 📄 [Download Resume](${resumeUrl})
• ✉️ **[Open Contact page — Send a message](/contact)**`
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('study') || q.includes('school')) {
    return `Anil’s education:\n\n${(EDUCATION || [])
      .map((e) => `• **${e.degree}** — ${e.school} (${e.score})`)
      .join('\n')}`
  }

  if (q.includes('cert')) {
    return `Selected certifications:\n\n${(CERTIFICATIONS || [])
      .slice(0, 6)
      .map((c) => `• ${c.name} — ${c.org}`)
      .join('\n')}`
  }

  if (
    q.includes('where') &&
    (q.includes('live') || q.includes('based') || q.includes('location') || q.includes('from') || q.includes('stay'))
  ) {
    return `Anil is based in **${CONTACT.location}**.

He currently works at **${job?.company || 'Ecolab'}** as an **${job?.title || 'AI Engineer'}**.`
  }

  if (
    hasWord(q, 'current') ||
    hasWord(q, 'present') ||
    q.includes('now working') ||
    q.includes('where does he work') ||
    q.includes('where do you work') ||
    hasWord(q, 'company') ||
    hasWord(q, 'ecolab')
  ) {
    return `Anil currently works as an **${job?.title || 'AI Engineer'}** at **${job?.company || 'Ecolab'}** (${job?.period || '13 July 2026 – Present'}).

${job?.bullets?.[0] ? `• ${job.bullets[0]}` : ''}

Ask **“experience”** to see his full work history.`
  }

  if (
    q.includes('personal') ||
    q.includes('family') ||
    q.includes('background') ||
    q.includes('my life') ||
    q.includes('parent') ||
    q.includes('sibling') ||
    q.includes('brother') ||
    q.includes('sister') ||
    q.includes('father') ||
    q.includes('mother') ||
    /\bhow are you\b/.test(q) ||
    q.includes('how you doing') ||
    q.includes('how is he') ||
    q.includes('how he is') ||
    q.includes('how everything') ||
    q.includes('how is everything')
  ) {
    return `Anil is doing great — personally and with family, everything is going well.

He is based in **Bangalore**, currently working as an **AI Engineer at Ecolab**, and focused on building strong Full Stack AI applications.

Thanks for asking!`
  }

  if (
    q.includes('who is anil') ||
    q.includes("who's anil") ||
    q.includes('tell me about anil') ||
    q.includes('about anil') ||
    (q.includes('about') && (hasWord(q, 'him') || hasWord(q, 'himself'))) ||
    hasWord(q, 'introduce') ||
    q.includes('who am i') ||
    q.includes('who i am')
  ) {
    return `**${CONTACT.name}** is an **${CONTACT.title || 'AI Engineer'}** currently at **${job?.company || 'Ecolab'}** (${job?.period || 'Present'}).

He builds AI platforms, LLM/RAG systems, and full stack apps. Previously he worked at **Rokkun Systems** and **GSK GCC** in Bangalore.

Ask about **skills**, **experience**, **projects**, or **contact** for more.`
  }

  if (
    hasWord(q, 'help') ||
    hasWord(q, 'check') ||
    hasWord(q, 'options') ||
    q.includes('what can you') ||
    q.includes('what do you know')
  ) {
    return `You can ask me about Anil’s:

1. **Skills** & tech stack
2. **Experience** (Ecolab, Rokkun, GSK)
3. **Projects**
4. **Education** & certifications
5. **Contact** / hire / resume
6. **Background** / location

Just type a topic — for example: “experience”, “skills”, or “contact”.`
  }

  // Meta chatbot identity — use word boundaries so "your" ≠ "you"
  if (
    q.includes('chatbot') ||
    (hasWord(q, 'assistant') && !q.includes('skill')) ||
    /\bwho are you\b/.test(q) ||
    /\bwhat are you\b/.test(q) ||
    (hasWord(q, 'ai') && (q.includes('bot') || q.includes('assistant') || q.includes('chat')))
  ) {
    return `I’m **AJ Assistant** — Anil’s portfolio chatbot.

I can answer questions about his **skills**, **experience**, **projects**, **education**, **background**, and **contact** details. Ask me anything about Anil!`
  }

  if (q.includes('hello') || hasWord(q, 'hi') || q.includes('hey') || q.includes('good morning') || q.includes('good evening')) {
    return `Hello! I’m Anil’s assistant.

Ask about his **skills**, **experience** (Ecolab / Rokkun / GSK), **projects**, **education**, or **contact** details — or type **help** for options.`
  }

  if (q.includes('thank')) {
    return `You’re welcome! Ask anything else about Anil — skills, experience, projects, or contact.`
  }

  // Also catch short chip-style / key project asks
  if (q.includes('key project') || q.includes('show me')) {
    const list = (PROJECTS || [])
      .slice(0, 6)
      .map((p) => `• **${p.title}** — ${(p.desc || '').slice(0, 100)}${(p.desc || '').length > 100 ? '…' : ''}`)
      .join('\n')
    return `Key projects from Anil’s portfolio:\n\n${list || '• Projects are listed on the Projects page of this site.'}`
  }

  // Off-topic / unknown questions — do not invent personal details
  return `I can’t answer that — I only share information about **Anil’s professional profile**.

Please ask about:
• **Skills** & tech stack
• **Experience** (Ecolab, Rokkun, GSK)
• **Projects**
• **Education** & certifications
• **Contact** / resume / LinkedIn / GitHub
• **Send a message**: [Open Contact page](/contact)

Type **help** to see all options.`
}

export default function Chatbot() {
  const { content, resumeUrl } = useSiteContent()
  const botCtx = {
    CONTACT: content.contact,
    EXPERIENCE: content.experience,
    EDUCATION: content.education,
    CERTIFICATIONS: content.certifications,
    PROJECTS: content.projects,
    resumeUrl,
  }
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm Anil's assistant. Ask about his skills, Ecolab/Rokkun/GSK experience, projects, or contact info.",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    document.body.classList.toggle('chatbot-open', isOpen)
    return () => document.body.classList.remove('chatbot-open')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    const onPointerDown = (e) => {
      const target = e.target
      if (target instanceof Element && target.closest('.chatbot-window, .chatbot-toggle, .chatbot-fab-anchor')) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [isOpen])

  const handleSend = (text) => {
    if (!text.trim() || isTyping) return

    setMessages((prev) => [...prev, { sender: 'user', text }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = getBotResponse(text, botCtx)
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }])
      setIsTyping(false)

      submitChat({ userMessage: text, botResponse }).catch((err) => {
        console.warn('submitChat failed:', err)
      })
    }, 800)
  }

  if (!mounted) return null

  return createPortal(
    <>
      {isOpen && (
        <button
          type="button"
          className="chatbot-backdrop"
          aria-label="Close chat"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          className="chatbot-window chatbot-window-center"
          ref={panelRef}
          role="dialog"
          aria-label="AI Assistant chat"
          aria-modal="true"
        >
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <i className="fas fa-robot" />
            </div>
            <div className="chatbot-info">
              <div className="chatbot-name">AJ Assistant</div>
              <div className="chatbot-status">
                <span className="chatbot-status-dot" />
                Online · Ready to help
              </div>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg-row ${msg.sender}`}>
                <div className="chat-msg-avatar">
                  {msg.sender === 'bot' ? <i className="fas fa-robot" /> : <i className="fas fa-user" />}
                </div>
                <div className={`chat-msg ${msg.sender}`}>
                  {msg.sender === 'bot' ? renderMessageText(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg-row bot">
                <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
                <div className="chat-typing" aria-label="Typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-chips">
            {CHIPS.map((chip) => (
              <button key={chip.label} type="button" className="chat-chip" onClick={() => handleSend(chip.query)}>
                {chip.label}
              </button>
            ))}
          </div>

          <form
            className="chatbot-input-area"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
          >
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask anything about Anil..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              aria-label="Chat message"
            />
            <button type="submit" className="chatbot-send" disabled={isTyping || !input.trim()} aria-label="Send message">
              <i className="fas fa-paper-plane" />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <div className="chatbot-fab-anchor">
          <div className="chatbot-fab-wrap">
            <button
              type="button"
              className="chatbot-hint"
              onClick={() => setIsOpen(true)}
              aria-label="Open chat — click here to ask anything about Anil"
            >
              Click here to ask anything about Anil
            </button>
            <button
              type="button"
              className="chatbot-toggle chatbot-toggle-anim"
              onClick={() => setIsOpen(true)}
              title="Click here to ask anything about Anil"
              aria-label="Open chat"
              ref={panelRef}
            >
              <i className="fas fa-robot" />
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}
