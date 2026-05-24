export function newListId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const EMPTY_EXPERIENCE = {
  title: 'Job Title',
  company: 'Company Name',
  location: 'City, Country',
  period: 'Jan 2024 – Present',
  type: 'Full-Time',
  current: false,
  bullets: ['Describe your impact here.'],
  tags: [],
}

export const EMPTY_SKILL_CATEGORY = {
  name: 'New Category',
  icon: '✦',
  skills: [],
}

export const EMPTY_EDUCATION = {
  degree: 'Degree Name',
  school: 'Institution',
  location: 'City, Country',
  period: '2020 – 2024',
  score: '',
  icon: '🎓',
}

export const EMPTY_CERTIFICATION = {
  name: 'Certification Name',
  org: 'Issuing Organization',
  date: 'Jan 2024',
}

export const EMPTY_PROJECT = {
  title: 'New Project',
  desc: 'Short project description for cards and listings.',
  tags: ['React', 'FastAPI'],
  cat: 'Full Stack',
  badge: 'Personal',
  badgeCls: 'open',
  img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
  link: '#',
  featured: false,
  details: {
    role: 'Your Role · Company',
    overview: 'Longer overview of the project, goals, and your contribution.',
    highlights: ['Key contribution or feature you built.'],
    outcomes: ['Measurable outcome or impact.'],
  },
}

export const EMPTY_SERVICE = {
  icon: '✦',
  cls: '',
  title: 'Service Title',
  desc: 'Describe what you offer in this area.',
  tags: ['Tag1', 'Tag2'],
}

export const EMPTY_TESTIMONIAL = {
  text: 'Testimonial quote goes here.',
  name: 'Person or Company',
  role: 'Their Role',
  initials: 'XX',
}

export const EMPTY_METRIC = { n: '0', l: 'Label' }
