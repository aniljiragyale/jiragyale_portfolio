/** Resume-aligned profile data — Anil Jiragyale */

export const CONTACT = {
  name: 'Anil Channappa Jiragyale',
  title: 'Full Stack AI Engineer',
  tagline: 'LLM & RAG Systems · Backend & API Development · React.js / Next.js',
  email: 'aniljiragyale07@gmail.com',
  phone: '+91 9591585862',
  location: 'Bangalore, India',
  linkedin: 'https://linkedin.com/in/anil-jiragyale',
  github: 'https://github.com/aniljiragyale',
  portfolio: 'https://portfolio-anil-two.vercel.app',
  emailjs: {
    serviceId: 'service_t7zf2hg',
    templateId: 'template_5xqoia9',
    publicKey: 'EfFovMSVNZE-iwywJ',
  },
}

export const SUMMARY =
  'Full Stack AI Engineer with enterprise experience building AI-powered platforms, LLM-integrated workflows, vector database systems, and scalable REST APIs at GSK GCC and Rokkun Systems. Delivered 3+ production platforms serving 100+ users — improving query accuracy by 30%, reducing manual effort by ~40%, and enabling large-scale semantic search using Milvus, LangChain, and LangGraph.'

export const SKILL_CATEGORIES = [
  {
    name: 'Languages',
    icon: '💻',
    skills: ['Python', 'JavaScript (ES6+)', 'Java', 'SQL'],
  },
  {
    name: 'Frontend',
    icon: '⚛️',
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Responsive UI'],
  },
  {
    name: 'Backend',
    icon: '⚡',
    skills: ['FastAPI', 'Node.js', 'Express.js', 'Spring Boot', 'REST APIs', 'Authentication'],
  },
  {
    name: 'AI / ML',
    icon: '🤖',
    skills: [
      'LangChain',
      'LangGraph',
      'RAG Architecture',
      'LLM Integration',
      'Milvus',
      'Semantic Search',
      'NLP',
      'TensorFlow',
      'Scikit-learn',
    ],
  },
  {
    name: 'Databases',
    icon: '💾',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'DuckDB', 'Milvus'],
  },
  {
    name: 'Cloud & DevOps',
    icon: '☁️',
    skills: ['AWS', 'Azure App Service', 'Git', 'GitHub', 'Jenkins', 'CI/CD', 'Linux'],
  },
  {
    name: 'Data & BI',
    icon: '📊',
    skills: ['Power BI', 'Pandas', 'NumPy', 'Matplotlib', 'Data Visualization'],
  },
]

export const EXPERIENCE = [
  {
    id: 'rokkun',
    title: 'Full Stack AI Engineer',
    company: 'Rokkun System Private Ltd',
    location: 'Bangalore, India',
    period: 'Apr 2026 – Present',
    type: 'Full-Time',
    current: true,
    bullets: [
      'Architected AI-powered market intelligence platform with news ingestion, semantic processing, and LLM retrieval using LangChain and LangGraph.',
      'Integrated Milvus vector database for large-scale semantic search with optimized chunking and embedding pipelines.',
      'Built semantic search with time-decay ranking and natural language time filtering across 10,000+ indexed documents.',
      'Developed user feedback loops (ratings, voting, comments) and REST APIs feeding model retraining and quality dashboards.',
      'Enhanced Next.js frontend UX; improved reliability with exception handling and Milvus retrieval fixes.',
    ],
    tags: ['LangChain', 'LangGraph', 'Milvus', 'FastAPI', 'Next.js', 'Node.js'],
  },
  {
    id: 'gsk-graduate',
    title: 'Graduate Trainee – AI & Full Stack Engineering',
    company: 'GlaxoSmithKline (GSK) GCC',
    location: 'Bangalore, India',
    period: 'Aug 2024 – Mar 2026',
    type: 'Full-Time',
    current: false,
    bullets: [
      'Engineered CDM Accelerator and CDM Intake production platforms — React.js, FastAPI, LLM integrations, Azure deployments for 100+ users.',
      'Implemented LLM query processing with guardrails and RAG, improving query accuracy by 30% and retrieval time by ~50%.',
      'Built ASK CDF AI chatbot for clinical documentation — 200+ query types using RAG and prompt engineering.',
      'Developed AI-driven ER diagram generator and hybrid validation engine, reducing manual review by ~40%.',
      'Deployed on Azure App Service with Jenkins CI/CD; built Power BI dashboards tracking 15+ KPIs.',
    ],
    tags: ['React.js', 'FastAPI', 'Azure', 'RAG', 'Power BI', 'Jenkins'],
  },
  {
    id: 'gsk-apprentice',
    title: 'Apprenticeship Trainee – Full Stack & DevOps',
    company: 'GlaxoSmithKline (GSK) GCC',
    location: 'Bangalore, India',
    period: 'Oct 2023 – Jul 2024',
    type: 'Apprenticeship',
    current: false,
    bullets: [
      'Developed and maintained 5+ MERN stack modules in a large-scale enterprise environment.',
      'Automated 3+ data processing workflows with Python, reducing manual reporting effort by ~60%.',
      'Conducted automation testing with 50+ test cases, achieving zero critical regression defects in final delivery.',
    ],
    tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Python'],
  },
]

export const EDUCATION = [
  {
    degree: 'B.E. Computer Science & Engineering',
    school: 'East Point College of Engineering and Technology',
    location: 'Bangalore, Karnataka',
    period: 'Feb 2020 – Jun 2024',
    score: 'CGPA: 7.44 / 10.0',
    icon: '🎓',
  },
  {
    degree: 'Pre-University (PUC) — Science',
    school: 'Ekalavya Science PU College',
    location: 'Harugeri, Karnataka',
    period: 'Jun 2018 – Mar 2020',
    score: 'Aggregate: 85%',
    icon: '📚',
  },
  {
    degree: 'Secondary School (SSLC)',
    school: 'Vidyavardhak High School',
    location: 'Athani, Karnataka',
    period: '2017 – 2018',
    score: 'Aggregate: 70%',
    icon: '🏫',
  },
]

export const CERTIFICATIONS = [
  { name: 'AI with Machine Learning – Final Exam', org: 'Oracle Academy', date: 'Dec 2023' },
  { name: 'Database Foundations', org: 'Oracle Academy', date: 'Nov 2023' },
  { name: 'Java Foundations – Final Exam', org: 'Oracle Academy', date: 'Oct 2022' },
  { name: 'Fundamentals of AI and ML', org: 'Infosys Springboard', date: 'Nov 2023' },
  { name: 'Big Data 101 (BD0101EN)', org: 'IBM SkillsBuild', date: 'Dec 2023' },
  { name: 'Certified Python Developer Associate (CPDA-24)', org: 'PDAC', date: 'Lifetime' },
  { name: 'Step into RPA', org: 'UiPath Academy', date: 'Nov 2023' },
  { name: 'Java Engineer Hiring Challenge – Certificate of Excellence', org: 'TechGig / Persistent', date: 'Sep 2024' },
]
