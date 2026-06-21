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

function renderMessageText(text) {
  const lines = text.split('\n')
  const elements = []

  lines.forEach((line, lineIndex) => {
    if (!line.trim() && lineIndex < lines.length - 1) {
      elements.push(<br key={`br-${lineIndex}`} />)
      return
    }

    const bulletMatch = line.match(/^(\d+\.|[-•])\s+(.*)/)
    const content = bulletMatch ? bulletMatch[2] : line

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

    const rendered = parts.length > 0 ? parts : content

    if (bulletMatch) {
      elements.push(<li key={`line-${lineIndex}`}>{rendered}</li>)
    } else if (line.trim()) {
      elements.push(<p key={`line-${lineIndex}`} className="chat-line">{rendered}</p>)
    }
  })

  const listItems = elements.filter((el) => el?.type === 'li')
  if (listItems.length > 0) {
    const paragraphs = elements.filter((el) => el?.type === 'p' || el?.type === 'br')
    return (
      <>
        {paragraphs}
        <ul className="chat-list">{listItems}</ul>
      </>
    )
  }

  return elements
}

function getBotResponse(query, { CONTACT, EXPERIENCE, EDUCATION, CERTIFICATIONS, PROJECTS, resumeUrl }) {
  const q = query.toLowerCase()

  // Chatbot description
  if (q.includes('chatbot') || q.includes('assistant') || q.includes('ai') || q.includes('ai assistant')) {
    return "I’m an AI assistant that can answer questions about Anil’s skills, experience, projects, education, personal background, and contact details. Ask me about \"skills\", \"experience\", \"education\", \"personal\", or \"contact\"."
  }

  // Help / Check / Options command
  if (q.includes('check') || q.includes('help') || q.includes('options')) {
    return "You can ask me about: skills, experience, projects, education, personal background, contact, or download the resume. Just type a keyword like \"skills\" or \"education\"."
  }
  // Personal / background info (expanded keywords)
  if (
    q.includes('personal') ||
    q.includes('family') ||
    q.includes('about me') ||
    q.includes('background') ||
    q.includes('my life') ||
    q.includes('my family') ||
    q.includes('my background') ||
    q.includes('who am i') ||
    q.includes('who i am') ||
    q.includes('how are you') ||
    q.includes('how you doing') ||
    q.includes('how is he') ||
    q.includes('how he is') ||
    q.includes('how everything') ||
    q.includes('how is everything')
  ) {
    return "Anil is doing fantastic! Personally and with his family, everything is going great and everyone is doing well. He is currently based in Bangalore, fully focused on his passion for building state-of-the-art Full Stack AI applications. Thanks for asking about him!";
  }

  if (q.includes('skill') || q.includes('technolog') || q.includes('lang') || q.includes('stack') || q.includes('core')) {
    return `Anil is a **Full Stack AI Engineer**. Key skills:

• **AI/ML**: LangChain, LangGraph, RAG, Milvus, LLM integration, NLP
• **Frontend**: React.js, Next.js, Tailwind CSS
• **Backend**: FastAPI, Node.js, Express.js, Spring Boot
• **Databases**: PostgreSQL, MySQL, MongoDB, Milvus
• **Cloud**: AWS, Azure App Service, Jenkins, CI/CD
• **Data**: Power BI, Pandas, TensorFlow, Scikit-learn`
  }

  if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('career') || q.includes('rokkun') || q.includes('gsk')) {
    return EXPERIENCE.map(
      (job, i) =>
        `${i + 1}. **${job.title}** at **${job.company}** (${job.period})\n   - ${job.bullets[0]}`
    ).join('\n\n')
  }

  if (q.includes('project') || q.includes('portfolio') || q.includes('build') || q.includes('made')) {
    return `Key projects from Anil's resume:\n\n${PROJECTS.map((p) => `• **${p.title}** — ${p.desc.slice(0, 90)}...`).join('\n')}`
  }

  if (q.includes('resume') || q.includes('cv')) {
    return `Download Anil's resume:\n👉 **[Download Resume PDF](${resumeUrl})**`
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || q.includes('github')) {
    return `Connect with **${CONTACT.name}**:

• 📧 [${CONTACT.email}](mailto:${CONTACT.email})
• 📞 **${CONTACT.phone}**
• 💼 [LinkedIn](${CONTACT.linkedin})
• 💻 [GitHub](${CONTACT.github})
• 📄 [Download Resume](${resumeUrl})`
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree')) {
    return EDUCATION.map((e) => `• **${e.degree}** — ${e.school} (${e.score})`).join('\n')
  }

  if (q.includes('cert')) {
    return CERTIFICATIONS.slice(0, 5).map((c) => `• ${c.name} — ${c.org}`).join('\n')
  }

  if (
    q.includes('family') ||
    q.includes('personal') ||
    q.includes('parent') ||
    q.includes('sibling') ||
    q.includes('brother') ||
    q.includes('sister') ||
    q.includes('father') ||
    q.includes('mother') ||
    q.includes('how are you') ||
    q.includes('how you doing') ||
    q.includes('how is he') ||
    q.includes('how he is') ||
    q.includes('how everything') ||
    q.includes('how is everything')
  ) {
    return "Anil is doing fantastic! Personally and with his family, everything is going great and everyone is doing well. He is currently based in Bangalore, fully focused on his passion for building state-of-the-art Full Stack AI applications. Thanks for asking about him!"
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! Ask about Anil's **skills**, **experience**, **projects**, or **contact** details."
  }

  return `**${CONTACT.name}** is a Full Stack AI Engineer (not a senior title) at Rokkun Systems and formerly GSK GCC.

Try: skills, experience, projects, education, personal background, contact, or type "check" for options.`
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
      text: "Hi! I'm Anil's assistant. Ask about his skills, GSK/Rokkun experience, projects, or contact info.",
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
                placeholder="Ask about skills, projects, contact..."
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
              className="chatbot-toggle chatbot-toggle-anim"
              onClick={() => setIsOpen(true)}
              title="AI Assistant — Ask anything about Anil"
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
