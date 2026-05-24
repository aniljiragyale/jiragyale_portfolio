import {
  CONTACT,
  SUMMARY,
  SKILL_CATEGORIES,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
} from './profile'
import { PROJECTS, PROJECT_CATEGORIES } from './projects'
import defaultResumeUrl from '../assets/Anil_Jiragyale_Resume_ATS.pdf'

const HOME_SERVICES = [
  {
    icon: '🤖',
    cls: '',
    title: 'AI & LLM Engineering',
    desc: 'Building production-grade LLM applications, RAG pipelines, semantic search systems, and intelligent agents using LangChain, OpenAI, and open-source models.',
    tags: ['LangChain', 'LangGraph', 'RAG', 'Milvus', 'LLM'],
  },
  {
    icon: '⚡',
    cls: 'purple',
    title: 'Full Stack Development',
    desc: 'End-to-end application development from responsive React frontends to scalable FastAPI/Node.js backends with clean architecture and robust APIs.',
    tags: ['React', 'FastAPI', 'Node.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    icon: '☁️',
    cls: 'gold',
    title: 'Cloud & DevOps',
    desc: 'Architecting cloud infrastructure, CI/CD pipelines, containerised deployments with monitoring, auto-scaling, and disaster recovery built in from day one.',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  },
]

const HOME_TESTIMONIALS = [
  {
    text: 'Anil delivered an AI-powered market intelligence platform that exceeded our expectations. His deep understanding of LLM systems and ability to translate complex requirements into clean, scalable code is remarkable.',
    name: 'Rokkun Systems',
    role: 'Engineering Team Lead',
    initials: 'RS',
  },
  {
    text: 'The semantic search API Anil built handles millions of queries with sub-100ms response times. His expertise in vector embeddings and system optimisation saved us months of development time.',
    name: 'GSK GCC',
    role: 'Data Science Department',
    initials: 'GK',
  },
  {
    text: "Working with Anil on our data pipeline was a pleasure. He brings technical excellence and genuine curiosity about the problem domain — a strong combination on any engineering team.",
    name: 'Tech Collaborator',
    role: 'Software Architect',
    initials: 'TC',
  },
  {
    text: "Anil's RAG system reduced our manual documentation effort by 40%. He's the kind of engineer who thinks about long-term maintainability, not just shipping fast.",
    name: 'Enterprise Client',
    role: 'Product Manager',
    initials: 'EC',
  },
]

function serializeProjects(list) {
  return list.map((p) => ({
    ...p,
    img: typeof p.img === 'string' ? p.img : String(p.img),
    tags: [...(p.tags || [])],
    details: p.details
      ? {
          ...p.details,
          highlights: [...(p.details.highlights || [])],
          outcomes: [...(p.details.outcomes || [])],
        }
      : undefined,
  }))
}

/** Default portfolio content — used when nothing is saved in admin storage */
export function getDefaultSiteContent() {
  return {
    version: 1,
    contact: { ...CONTACT, emailjs: { ...CONTACT.emailjs } },
    summary: SUMMARY,
    resume: {
      fileName: 'Anil_Jiragyale_Resume_ATS.pdf',
      dataUrl: null,
      bundledUrl: defaultResumeUrl,
    },
    skillCategories: SKILL_CATEGORIES.map((c) => ({
      ...c,
      skills: [...c.skills],
    })),
    experience: EXPERIENCE.map((e) => ({
      ...e,
      bullets: [...e.bullets],
      tags: [...e.tags],
    })),
    education: EDUCATION.map((e) => ({ ...e })),
    certifications: CERTIFICATIONS.map((c) => ({ ...c })),
    projects: serializeProjects(PROJECTS),
    projectCategories: [...PROJECT_CATEGORIES],
    home: {
      heroStatus: 'Open to Full-Time Opportunities',
      photoCard1: { big: 'Full Stack AI 🚀', sm: 'Rokkun · GSK GCC · Bangalore' },
      photoCard2: { big: 'LLM & RAG ✦', sm: '100+ Enterprise Users' },
      metrics: [
        { n: '2+', l: 'Years AI/FS Dev' },
        { n: '3+', l: 'Prod Platforms' },
        { n: '100+', l: 'Enterprise Users' },
        { n: '20+', l: 'Tech Stack' },
      ],
      statsBar: [
        { n: '30%', l: 'Query Accuracy Improvement' },
        { n: '40%', l: 'Manual Effort Reduced' },
        { n: '10K+', l: 'Documents Indexed (Semantic Search)' },
        { n: '100ms', l: 'Search API Response Time' },
      ],
      services: HOME_SERVICES.map((s) => ({ ...s, tags: [...s.tags] })),
      testimonials: HOME_TESTIMONIALS.map((t) => ({ ...t })),
      ctaTitle: 'Ready to Build Something Amazing?',
      ctaText:
        "I'm actively seeking full-time roles in AI Engineering, Full Stack Development, or Product-Driven Companies.",
    },
    about: {
      extraParagraphs: [
        'I build production AI platforms with LangChain, LangGraph, Milvus, FastAPI, React.js, and Next.js — from RAG chatbots and semantic search to enterprise clinical data systems at GSK GCC and market intelligence tools at Rokkun Systems.',
        'Open to full-time roles in AI engineering, full stack development, and product-driven teams. I focus on reliable systems, clear APIs, and measurable impact.',
      ],
      tags: [
        '🤖 AI / LLM / RAG',
        '🛠️ Full Stack',
        '☁️ Azure & AWS',
        '📊 Power BI & Data',
        '🔧 FastAPI & React',
      ],
    },
  }
}

export function getResumeDownloadUrl(content) {
  if (content?.resume?.dataUrl) return content.resume.dataUrl
  return content?.resume?.bundledUrl || defaultResumeUrl
}

export function getResumeFileName(content) {
  return content?.resume?.fileName || 'Anil_Jiragyale_Resume_ATS.pdf'
}

export function getFeaturedProjects(content) {
  return (content?.projects || []).filter((p) => p.featured)
}
