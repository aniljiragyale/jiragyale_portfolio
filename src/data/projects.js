import imgCdmAccel from '../assets/projects/project0.jpg'
import imgCovid from '../assets/projects/project1.jpg'
import imgAirline from '../assets/projects/project2.jpg'

// High-quality thematic covers (Unsplash) for projects without local assets
const IMG_TARIFF =
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7246ca?auto=format&fit=crop&w=800&q=80'
const IMG_CDM_INTAKE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
const IMG_ASK_CDF =
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'

export const PROJECTS = [
  {
    id: 'tariff-prediction',
    title: 'Tariff Prediction Model',
    desc: 'AI-powered tariff prediction using time-series forecasting and ML on economic and policy datasets. Integrated with the market intelligence platform for actionable tariff risk insights.',
    tags: ['Python', 'ML', 'Time-Series', 'FastAPI', 'Data Pipelines'],
    cat: 'AI/ML',
    badge: 'Rokkun',
    badgeCls: 'ent',
    img: IMG_TARIFF,
    link: '#',
    featured: true,
  },
  {
    id: 'cdm-accelerator',
    title: 'CDM Accelerator',
    desc: 'Enterprise AI Clinical Data Management platform with ASK CDF (RAG chatbot), ER Extractor, and S2T Validator — deployed to 100+ users at GSK GCC with 30% improved query accuracy.',
    tags: ['React.js', 'FastAPI', 'RAG', 'Azure', 'Power BI'],
    cat: 'AI/ML',
    badge: 'Enterprise',
    badgeCls: 'ent',
    img: imgCdmAccel,
    link: '#',
    featured: true,
  },
  {
    id: 'cdm-intake',
    title: 'CDM Intake',
    desc: 'Clinical data intake, validation, and routing platform with React.js UI, FastAPI/Node.js APIs, and AI + rule-based validation — reducing intake processing time by ~35%.',
    tags: ['React.js', 'FastAPI', 'MySQL', 'MongoDB', 'Node.js'],
    cat: 'Full Stack',
    badge: 'Enterprise',
    badgeCls: 'ml',
    img: IMG_CDM_INTAKE,
    link: '#',
    featured: true,
  },
  {
    id: 'ask-cdf',
    title: 'ASK CDF – AI Clinical Chatbot',
    desc: 'RAG-powered chatbot for natural language querying of clinical documentation — processing 200+ query types with guardrail validation and prompt engineering.',
    tags: ['LangChain', 'RAG', 'LLM', 'FastAPI', 'React.js'],
    cat: 'AI/ML',
    badge: 'GSK GCC',
    badgeCls: 'open',
    img: IMG_ASK_CDF,
    link: '#',
    featured: true,
  },
  {
    id: 'airline-reservation',
    title: 'Airline Reservation System',
    desc: 'Full-stack airline reservation system with flight search, seat booking, and ticket tracking — supporting 500+ simulated bookings using Spring Boot and MySQL.',
    tags: ['React.js', 'Spring Boot', 'MySQL', 'REST APIs'],
    cat: 'Full Stack',
    badge: 'Academic',
    badgeCls: 'devops',
    img: imgAirline,
    link: 'https://github.com/aniljiragyale/airline-reservation-system',
    featured: true,
  },
  {
    id: 'covid-prediction',
    title: 'COVID-19 Spread Prediction',
    desc: 'Predictive ML model achieving 85% accuracy by benchmarking LASSO Regression, ARIMA, and LSTM across 12 months of epidemiological training data.',
    tags: ['Python', 'LSTM', 'ARIMA', 'TensorFlow', 'Scikit-learn'],
    cat: 'AI/ML',
    badge: 'Academic',
    badgeCls: 'ml',
    img: imgCovid,
    link: 'https://github.com/aniljiragyale/Computational-tracking-and-estimating-of-covid-19-dynamic-broadcast-based-on-machine-learning.-.',
    featured: true,
  },
]

export const PROJECT_CATEGORIES = ['All', 'AI/ML', 'Full Stack']

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured)
