// Single source of truth for portfolio content.
//
// Each section is rendered twice — once as a static, SEO-friendly page under
// `app/*/page.tsx` and once as an interactive pane under
// `components/TerminalComp/*`. The two renderings differ on purpose, but the
// underlying data must not. Both sides import from here so the lists stay in
// lock-step (they had already drifted before this was centralized).

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface Project {
  name: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tech: string[];
}

export const projects: Project[] = [
  {
    name: "PipesHub",
    description:
      "Open-source workplace AI / enterprise context layer for permissioned search, RAG, and agentic workflows across 50+ connectors. Contributing as an SDE — helping extend the governed context layer for explainable enterprise search, MCP, and self-hosted AI automation.",
    imageUrl: "/images/pipeshub-project.png",
    liveUrl: "https://pipeshub.com",
    githubUrl: "https://github.com/pipeshub-ai/pipeshub-ai",
    tech: [
      "Python",
      "Express.js",
      "MongoDB",
      "Qdrant",
      "ArangoDB",
      "Redis",
      "Docker",
      "RAG",
      "MCP",
    ],
  },
  {
    name: "Yuviz",
    description:
      "Open-source voice AI platform: real-time STT → LLM (tool-calling, RAG, human transfer) → TTS over SIP telephony or browser testing. Contributing as an SDE on the voice pipeline, gateway, and self-hosted Docker stack.",
    imageUrl: "/images/yuviz-project.png",
    liveUrl: "https://github.com/yuviz-ai/yuviz",
    githubUrl: "https://github.com/yuviz-ai/yuviz",
    tech: [
      "Python",
      "SIP",
      "STT",
      "LLM",
      "TTS",
      "Docker",
      "RAG",
      "Tool Calling",
    ],
  },
  {
    name: "Dograh",
    description:
      "Open-source, self-hostable voice AI platform (Vapi/Retell alternative) with a visual workflow builder, BYOK LLM/STT/TTS, telephony, and MCP. Contributing as an SDE on production voice-agent orchestration and self-hosted deployments.",
    imageUrl: "/images/dograh-project.png",
    liveUrl: "https://www.dograh.com",
    githubUrl: "https://github.com/dograh-hq/dograh",
    tech: [
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "Redis",
      "MinIO",
      "Pipecat",
      "Docker",
      "MCP",
    ],
  },
  {
    name: "AutoPulse",
    description:
      "A multi-tenant dealership and automotive management application for showroom visitor management with WhatsApp integration, digital & field enquiries, delivery updates, vehicle models, lead sources, and templates. Includes RBAC, organization-level feature toggles, lead/CRM workflows, and has been deployed to 5+ showrooms with 5000+ visitor entries.",
    imageUrl: "/images/autopulse.png",
    liveUrl: "#",
    githubUrl: "https://github.com/anupPradhan0/AutoPulseOLD",
    tech: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS 4",
      "Radix UI",
      "Express.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "JWT",
      "RabbitMQ",
    ],
  },
  {
    name: "AI-powered personal finance tracker",
    description:
      "RukiAI is an AI-driven personal finance tracker designed to help users log expenses, set budgets, and receive smart, personalized financial advice. Built with Node.js, MongoDB, and EJS, it integrates Cohere's AI API to deliver real-time insights while also featuring a custom local AI model to demonstrate advanced AI capabilities for recruiters. The project showcases both cloud-based AI integration and self-hosted model development in one application.",
    imageUrl: "/images/ruki-ai-project.png",
    liveUrl: "https://ruki.anuppradhan.in/",
    githubUrl: "https://github.com/anupPradhan0/AI-Personal-Finance-Tracker",
    tech: [
      "Node.js",
      "Express",
      "MongoDB",
      "EJS",
      "Tailwind",
      "JavaScript",
      "Cohere AI",
    ],
  },
  {
    name: "WhatsApp Campaign Management Platform",
    description:
      "A full-stack MERN application for managing WhatsApp marketing campaigns with role-based access for admins and resellers. Features include client onboarding, financial transaction tracking with credit/debit records, and an integrated complaint management system. Built with React and TypeScript, featuring hierarchical user tree visualization with collapsible nodes and modal views. Backend powered by Node.js, Express, and MongoDB with Mongoose ODM for handling transactions, user management, and campaign operations. Integrated Cloudinary for image storage with automated cleanup scheduling.",
    imageUrl: "/images/whatsApp-Campaign.png",
    liveUrl: "https://whats-app-campaigner.vercel.app",
    githubUrl: "https://github.com/anupPradhan0/WhatsApp-Campaigner",
    tech: [
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose(ODM)",
      "Cloudinary",
    ],
  },
  {
    name: "Neural Network From Scratch (in Python)",
    description:
      "Tech: Python, NumPy, Matplotlib, Tensorflow. Implemented a basic neural network from the ground up using only Python and NumPy—no external ML libraries. Designed input, hidden, and output layers; implemented forward propagation, activation functions (Sigmoid/ReLU), and backpropagation manually. Trained on sample data to demonstrate model learning.",
    imageUrl: "/images/neural-network-project.png",
    liveUrl: "https://digit-recognizer-fullstack.vercel.app/",
    githubUrl: "https://github.com/anupPradhan0/digit-recognition-neural-network",
    tech: ["Python", "NumPy", "Matplotlib", "Tensorflow", "Jupyter Notebook"],
  },
  {
    name: "YouTube Backend",
    description:
      "Designed and built a backend system simulating YouTube features using Node.js, Express, and MongoDB. Implemented video upload, metadata storage, user registration & login with JWT auth. Structured REST APIs to handle likes, comments, views, and subscriptions. Deployed with Postman testing and MongoDB Atlas.",
    imageUrl: "/images/youtube-backend-project.png",
    liveUrl: "#",
    githubUrl: "https://github.com/anupPradhan0/YouTube-Clone-Backend",
    tech: ["Node.js", "Express", "MongoDB", "JWT", "Postman", "MongoDB Atlas"],
  },
  {
    name: "Network Marketing Full-stack",
    description:
      "Network Marketing Platform is a full-stack web application for managing a multi-level marketing (MLM) system. It allows users to register, refer others through unique affiliate links, track team members, view transaction and purchase histories, and monitor course progress.",
    imageUrl: "/images/network-marketing-project.png",
    liveUrl: "#",
    githubUrl: "https://github.com/anupPradhan0/Network-Marketing",
    tech: [
      "MongoDB",
      "Express",
      "Node.js",
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind",
    ],
  },
  {
    name: "AI Fiesta clone Fun projects",
    description:
      "AI Madness is a premium web application that lets users submit a single prompt and instantly compare responses from multiple AI models (ChatGPT, Claude, Gemini, Perplexity, DeepSeek) on one dashboard. Built with Node.js, Express, MongoDB, and Cohere API, featuring glassmorphism design, neon effects, and toggle-enabled AI panels for seamless multi-model testing.",
    imageUrl: "/images/ai-fiesta-project.png",
    liveUrl: "https://ai-madness.onrender.com/",
    githubUrl: "https://github.com/anupPradhan0/AI-Madness",
    tech: [
      "Node.js",
      "MongoDB",
      "Express",
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind",
      "Cohere AI",
    ],
  },
];

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export interface SkillsCategory {
  languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  tools: string[];
  deployment: string[];
  ai_ml: string[];
}

export const skills: SkillsCategory = {
  languages: ["JavaScript (ES6+)", "TypeScript", "Python", "C++", "HTML5", "CSS3"],
  frontend: ["React", "Next.js", "Remix", "TanStack Query", "Tailwind CSS", "EJS", "Vite"],
  backend: ["Node.js", "Express.js", "FastAPI", "REST APIs", "OAuth 2.0", "JWT"],
  databases: [
    "MongoDB",
    "Mongoose",
    "MongoDB Atlas",
    "RabbitMQ",
    "Redis",
    "PostgreSQL",
    "VectorDB",
    "Weaviate",
    "Neo4j",
  ],
  tools: [
    "Git & GitHub",
    "Docker",
    "Kubernetes",
    "Postman",
    "Linux/CLI",
    "Claude Code",
    "OpenCode",
    "Ubuntu",
    "Arch Linux",
  ],
  deployment: [
    "AWS S3",
    "Azure",
    "GCP",
    "VPS (Virtual Private Server)",
    "Vercel",
    "Render",
    "Dokploy",
  ],
  ai_ml: [
    "Pandas",
    "NumPy",
    "PyTorch",
    "TensorFlow",
    "RAG (Retrieval-Augmented Generation)",
    "Tool Calling",
    "MCP (Model Context Protocol)",
  ],
};

// Faux shell command shown above each skill category.
export const skillCommands: Record<keyof SkillsCategory, string> = {
  languages: "ls -la /skills/languages/",
  frontend: "cat /skills/frontend/stack.txt",
  backend: "ps aux | grep backend",
  databases: "show databases;",
  tools: "which --all tools",
  deployment: "kubectl get deployments -A",
  ai_ml: "python -m pip list | grep ai",
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const CONTACT_EMAIL = "anuppradhan929@gmail.com";
export const CONTACT_LOCATION = "Bhubaneswar, Odisha, India";
export const RESUME_URL =
  "https://drive.google.com/file/d/14VsKNKYOgkwxUzV8RUUslFsyw8_lGltr/view?usp=sharing";

// Icon rendering differs between the static page and the terminal pane, so each
// side keys its own icon set off `name`; only the link metadata lives here.
export interface SocialLinkData {
  name: string;
  href: string;
  color: string;
}

export const socialLinks: SocialLinkData[] = [
  { name: "YouTube", href: "https://www.youtube.com/@mors.dev7", color: "red" },
  { name: "Twitter / X", href: "https://x.com/AnupPradhan0", color: "blue" },
  { name: "Instagram", href: "https://www.instagram.com/anuppradhan.in", color: "pink" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/anuppradhan0", color: "blue" },
  { name: "GitHub", href: "https://github.com/anupPradhan0", color: "purple" },
  { name: "LeetCode", href: "https://leetcode.com/u/Anuppradhan/", color: "yellow" },
];

// ---------------------------------------------------------------------------
// Experience — role start/end dates
//
// Fixed end dates are used for the Crunchy Media record so the timeline stops
// after the last verified work date instead of continuing to "Present".
// ---------------------------------------------------------------------------

export const OPEN_SOURCE_START = new Date(2026, 8, 1); // Sep 2026
/** Rolling "today" so duration labels stay current for ongoing roles. */
export const OPEN_SOURCE_END = new Date();

export const CHATI_INTERN_START = new Date(2025, 9, 1); // Oct 2025
export const CHATI_INTERN_END = new Date(2026, 2, 31); // Mar 2026
export const CHATI_JR_START = new Date(2026, 3, 1); // Apr 2026
export const CHATI_JR_END = new Date(2026, 7, 31); // Aug 2026

export const PROMINDS_START = new Date(2025, 3, 1); // Apr 2025
export const PROMINDS_END = new Date(2026, 3, 30); // Apr 2026
export const PROMINDS_FULLSTACK_START = new Date(2025, 10, 1); // Nov 2025
export const PROMINDS_FULLSTACK_END = new Date(2026, 3, 30); // Apr 2026
export const PROMINDS_WORDPRESS_START = new Date(2025, 3, 1); // Apr 2025
export const PROMINDS_WORDPRESS_END = new Date(2025, 10, 30); // Nov 2025

export type ExperienceRole = {
  title: string;
  employmentType: string;
  start: Date;
  end: Date;
  /** When true, UI shows "Present" instead of the end month. */
  ongoing?: boolean;
  mode?: string;
  bullets: string[];
};

export type ExperienceCompany = {
  name: string;
  logo: string;
  location: string;
  workMode?: string;
  roles: ExperienceRole[];
};

export const experienceCompanies: ExperienceCompany[] = [
  {
    name: "Open Source",
    logo: "/images/open-source.jpeg",
    location: "Remote",
    roles: [
      {
        title: "SDE",
        employmentType: "Open Source",
        start: OPEN_SOURCE_START,
        end: OPEN_SOURCE_END,
        ongoing: true,
        bullets: [
          "PipesHub: Contributing to the open-source enterprise context layer for permissioned search, RAG, MCP, and agentic workplace AI workflows.",
          "Yuviz: Building on the voice AI stack — real-time STT → LLM (tool-calling/RAG/transfer) → TTS over SIP and browser testing.",
          "Dograh: Contributing to the self-hosted open-source voice agent platform (Vapi/Retell alternative) with workflow builder, telephony, and MCP.",
        ],
      },
    ],
  },
  {
    name: "Crunchy Media Pvt Ltd",
    logo: "/images/Crunchy-Media-Pvt-Ltd.jpeg",
    location: "Bhubaneswar, Odisha, India",
    workMode: "On-site",
    roles: [
      {
        title: "SDE-1",
        employmentType: "Full-time",
        start: CHATI_JR_START,
        end: CHATI_JR_END,
        bullets: [
          "Product Leadership: Serving as lead developer architecting a B2B AI Voice Calling SaaS platform for automated inbound and outbound voice systems.",
          "Telephony Infrastructure: Engineering high-availability VoIP infrastructure using FreeSWITCH, ESL, and WebRTC to orchestrate real-time, low-latency audio streaming.",
          "Voice AI Pipeline: Integrating low-latency STT, LLM orchestration, and TTS pipelines to deliver human-like conversational responses during live calls.",
        ],
      },
      {
        title: "Software Developer Intern",
        employmentType: "Internship",
        start: CHATI_INTERN_START,
        end: CHATI_INTERN_END,
        bullets: [
          "AI Meeting Assistant: Built an AI assistant for Zoom, Teams, and Google Meet that automates recording and transcript summaries for 500+ active users.",
          "High-Performance Pipeline: Engineered a batch-processing system that cleaned, validated, and migrated 1.2M+ records into production in under 10 minutes.",
          "Algorithmic Deduplication: Designed a Union–Find based clustering system to deduplicate related records in near O(1) time per link.",
        ],
      },
    ],
  },
  {
    name: "Prominds Digital",
    logo: "/images/PromindsD.png",
    location: "Bhubaneswar, Odisha, India",
    roles: [
      {
        title: "Full Stack Developer",
        employmentType: "Hybrid",
        start: PROMINDS_FULLSTACK_START,
        end: PROMINDS_FULLSTACK_END,
        bullets: [
          "Developed an automotive visitor management SaaS used by 5 dealerships (5k+ monthly entries) featuring WhatsApp automation and lead pipelines.",
          "Managing the architectural shift and migration of legacy infrastructure to a modern, streamlined CRM solution.",
        ],
      },
      {
        title: "WordPress Developer",
        employmentType: "Remote",
        start: PROMINDS_WORDPRESS_START,
        end: PROMINDS_WORDPRESS_END,
        bullets: [
          "Launched 5 WordPress websites and optimized performance scores by 50% (achieving a peak score of 84).",
        ],
      },
    ],
  },
];
