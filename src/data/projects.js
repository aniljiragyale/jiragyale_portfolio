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
    details: {
      role: 'AI / ML Engineer · Rokkun Systems',
      overview:
        'Built a tariff prediction engine that forecasts trade policy and tariff movements using time-series models and machine learning on economic indicators, policy signals, and historical tariff datasets. The system integrates with Rokkun’s market intelligence platform so analysts can assess tariff risk before making sourcing and pricing decisions.',
      highlights: [
        'Designed feature pipelines for economic, trade, and policy datasets with automated preprocessing and validation.',
        'Benchmarked forecasting approaches including statistical baselines and ML models for multi-horizon predictions.',
        'Exposed predictions through FastAPI endpoints consumed by the market intelligence dashboard.',
        'Packaged model outputs with confidence intervals and scenario views for business stakeholders.',
      ],
      outcomes: [
        'Enabled proactive tariff risk analysis instead of reactive spreadsheet workflows.',
        'Reduced manual data preparation effort for market research teams.',
        'Delivered a reusable ML pipeline for future trade and policy forecasting use cases.',
      ],
    },
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
    details: {
      role: 'Full Stack AI Engineer · GSK GCC',
      overview:
        'CDM Accelerator is an enterprise clinical data management platform combining AI-assisted tooling with robust validation workflows. It includes ASK CDF (RAG chatbot), ER Extractor, and S2T Validator modules — deployed to 100+ users and improving query accuracy by 30% across clinical documentation workflows.',
      highlights: [
        'Architected modular React.js frontends with FastAPI microservices on Azure App Service.',
        'Integrated RAG-based document retrieval for clinical query answering with guardrails.',
        'Built ER Extractor and S2T Validator tools to automate extraction and mapping validation.',
        'Added Power BI dashboards for adoption, query volume, and accuracy tracking.',
      ],
      outcomes: [
        '100+ enterprise users onboarded across GSK GCC clinical data teams.',
        '30% improvement in query accuracy for documentation search and validation tasks.',
        '~40% reduction in manual effort for repetitive clinical data review workflows.',
      ],
    },
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
    details: {
      role: 'Full Stack Developer · GSK GCC',
      overview:
        'CDM Intake streamlines how clinical study data enters the organization — from submission through validation, routing, and handoff to downstream systems. The platform blends rule-based checks with AI-assisted validation to catch errors early and speed up intake processing.',
      highlights: [
        'Built responsive React.js intake UI with role-based views for submitters and reviewers.',
        'Implemented FastAPI and Node.js services for validation, routing, and audit logging.',
        'Designed hybrid AI + rules engine to flag schema issues, missing fields, and anomalies.',
        'Connected MySQL and MongoDB stores for structured metadata and flexible document payloads.',
      ],
      outcomes: [
        '~35% reduction in average intake processing time.',
        'Fewer downstream rework cycles thanks to early validation at submission.',
        'Clear audit trail for compliance and traceability across intake events.',
      ],
    },
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
    details: {
      role: 'AI Engineer · GSK GCC',
      overview:
        'ASK CDF is a RAG-powered clinical chatbot that lets users query complex documentation in natural language. It supports 200+ query patterns with guardrail validation, prompt engineering, and retrieval tuned for regulated clinical content.',
      highlights: [
        'Built LangChain RAG pipelines with embedding search and context-aware answer generation.',
        'Implemented guardrails for hallucination reduction, scope limits, and citation-style responses.',
        'Tuned prompts and retrieval for 200+ recurring clinical query types.',
        'Delivered FastAPI backend and React.js chat UI integrated into CDM Accelerator.',
      ],
      outcomes: [
        '200+ supported query types for clinical documentation lookup.',
        'Sub-second retrieval for most common document queries in production usage.',
        'Significant reduction in time spent searching static PDF and wiki documentation.',
      ],
    },
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
    details: {
      role: 'Full Stack Developer · Academic Project',
      overview:
        'A full-stack airline reservation system covering flight search, seat selection, booking confirmation, and ticket tracking. Built with React.js and Spring Boot, it simulates real-world reservation flows with REST APIs and a relational MySQL schema.',
      highlights: [
        'Designed REST APIs for flights, seats, bookings, and passenger management.',
        'Built React.js UI for search, booking wizard, and ticket status views.',
        'Modeled relational schema in MySQL with constraints for seat availability.',
        'Handled booking lifecycle states: search → reserve → confirm → track.',
      ],
      outcomes: [
        '500+ simulated bookings processed in testing scenarios.',
        'End-to-end demo of production-style API and UI separation.',
        'Reusable template for CRUD-heavy full stack applications.',
      ],
    },
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
    details: {
      role: 'ML Engineer · Academic Research',
      overview:
        'A comparative study of epidemiological forecasting models for COVID-19 spread prediction. The project benchmarks LASSO Regression, ARIMA, and LSTM architectures on 12 months of training data to identify the best-performing approach for short-term case trend estimation.',
      highlights: [
        'Collected and cleaned multi-source epidemiological datasets for model training.',
        'Implemented LASSO, ARIMA, and LSTM pipelines with consistent evaluation metrics.',
        'Visualized forecast vs. actual trends to compare model stability and accuracy.',
        'Documented methodology, hyperparameters, and reproducible training scripts.',
      ],
      outcomes: [
        '85% accuracy achieved on held-out evaluation windows with the best-performing model.',
        'Clear comparison of statistical vs. deep learning approaches for epidemic forecasting.',
        'Open-source repository with notebooks and model training code.',
      ],
    },
  },
]

export const PROJECT_CATEGORIES = ['All', 'AI/ML', 'Full Stack']

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured)

export function getProjectById(id, projects = PROJECTS) {
  return projects.find((p) => p.id === id) || null
}
