import { Metadata } from "next";
import Image from "next/image";

// Enhanced SEO Metadata
export const metadata: Metadata = {
  title: "Projects | Full-Stack MERN Developer Portfolio",
  description:
    "Explore my portfolio of full-stack web applications including WhatsApp Campaign Management, AI-powered finance tracker, neural networks, and more. Built with MERN stack, TypeScript, Python, and modern web technologies.",
  keywords: [
    "MERN Stack Projects",
    "Full Stack Portfolio",
    "WhatsApp Campaign Management",
    "AI Finance Tracker",
    "Neural Network Projects",
    "Network Marketing Platform",
    "YouTube Backend Clone",
    "React TypeScript Projects",
    "MongoDB Express Projects",
    "Machine Learning Projects",
    "Python Neural Network",
    "Web Development Portfolio",
    "Node.js Projects",
    "REST API Projects",
    "Full Stack Developer Portfolio India",
  ],
  authors: [{ name: "MERN Stack Developer" }],
  openGraph: {
    title: "Projects | Full-Stack MERN Developer Portfolio",
    description:
      "Portfolio showcasing full-stack web applications, AI projects, and machine learning implementations using MERN stack, TypeScript, and Python.",
    type: "website",
    siteName: "Developer Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Full-Stack Developer Portfolio",
    description:
      "Full-stack MERN projects, AI applications, and machine learning implementations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/projects",
  },
};

// Type definitions
interface Project {
  name: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tech: string[];
}

// Projects data
const projectsData: Project[] = [
  {
    name: "WhatsApp Campaign Management Platform",
    description:
      "A full-stack MERN application for managing WhatsApp marketing campaigns with role-based access for admins and resellers. Features include client onboarding, financial transaction tracking with credit/debit records, and an integrated complaint management system. Built with React and TypeScript, featuring hierarchical user tree visualization with collapsible nodes and modal views. Backend powered by Node.js, Express, and MongoDB with Mongoose ODM for handling transactions, user management, and campaign operations. Integrated Cloudinary for image storage with automated cleanup scheduling.",
    imageUrl: "/images/whatsApp-Campaign.png",
    liveUrl: "https://whats-app-campaigner.vercel.app",
    githubUrl: "https://github.com/M0rs-Ruki/WhatsApp-Campaigner",
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
    name: "AI-powered personal finance tracker",
    description:
      "RukiAI is an AI-driven personal finance tracker designed to help users log expenses, set budgets, and receive smart, personalized financial advice. Built with Node.js, MongoDB, and EJS, it integrates Cohere's AI API to deliver real-time insights while also featuring a custom local AI model to demonstrate advanced AI capabilities for recruiters. The project showcases both cloud-based AI integration and self-hosted model development in one application.",
    imageUrl: "/images/ruki-ai-project.png",
    liveUrl: "https://www.rukiai.online/",
    githubUrl: "https://github.com/M0rs-Ruki/AI-Personal-Finance-Tracker",
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
    name: "Neural Network From Scratch (in Python)",
    description:
      "Tech: Python, NumPy, Matplotlib, Tensorflow. Implemented a basic neural network from the ground up using only Python and NumPy—no external ML libraries. Designed input, hidden, and output layers; implemented forward propagation, activation functions (Sigmoid/ReLU), and backpropagation manually. Trained on sample data to demonstrate model learning.",
    imageUrl: "/images/neural-network-project.png",
    liveUrl: "https://digit-recognizer-fullstack.vercel.app/",
    githubUrl: "https://github.com/M0rs-Ruki/digit-recognition-neural-network",
    tech: ["Python", "NumPy", "Matplotlib", "Tensorflow", "Jupyter Notebook"],
  },
  {
    name: "Network Marketing Full-stack",
    description:
      "Network Marketing Platform is a full-stack web application for managing a multi-level marketing (MLM) system. It allows users to register, refer others through unique affiliate links, track team members, view transaction and purchase histories, and monitor course progress.",
    imageUrl: "/images/network-marketing-project.png",
    liveUrl: "#",
    githubUrl: "https://github.com/M0rs-Ruki/Network-Marketing",
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
    name: "YouTube Backend",
    description:
      "Designed and built a backend system simulating YouTube features using Node.js, Express, and MongoDB. Implemented video upload, metadata storage, user registration & login with JWT auth. Structured REST APIs to handle likes, comments, views, and subscriptions. Deployed with Postman testing and MongoDB Atlas.",
    imageUrl: "/images/youtube-backend-project.png",
    liveUrl: "#",
    githubUrl: "https://github.com/M0rs-Ruki/YouTube-Clone-Backend",
    tech: ["Node.js", "Express", "MongoDB", "JWT", "Postman", "MongoDB Atlas"],
  },
  {
    name: "AI Fiesta clone Fun projects",
    description:
      "AI Madness is a premium web application that lets users submit a single prompt and instantly compare responses from multiple AI models (ChatGPT, Claude, Gemini, Perplexity, DeepSeek) on one dashboard. Built with Node.js, Express, MongoDB, and Cohere API, featuring glassmorphism design, neon effects, and toggle-enabled AI panels for seamless multi-model testing.",
    imageUrl: "/images/ai-fiesta-project.png",
    liveUrl: "https://ai-madness.onrender.com/",
    githubUrl: "https://github.com/M0rs-Ruki/AI-Madness",
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

// Simplified SVG Icons
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const TerminalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 7v12h18V7H3zm6.5 6l-2-2 2-2L8 7.5 5.5 10 8 12.5 9.5 11zm6 2h-3v-2h3v2z" />
  </svg>
);

// Enhanced JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Full-Stack Development Projects",
  description: "Portfolio of MERN stack and machine learning projects",
  itemListElement: projectsData.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      name: project.name,
      description: project.description,
      applicationCategory: "WebApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: project.liveUrl !== "#" ? project.liveUrl : project.githubUrl,
      programmingLanguage: project.tech,
    },
  })),
};

// Main Server Component - Lightweight Version
export default function Projects() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="min-h-screen bg-black text-white pb-16">
        <div className="text-white space-y-4 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-4">
          {/* Header */}
          <header className="flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-8 pt-6">
            <TerminalIcon />
            <h1 className="text-lg sm:text-2xl text-green-400 font-bold font-mono tracking-wider">
              ~/projects
            </h1>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
            <span className="text-green-400/60 text-xs sm:text-sm font-mono">
              {projectsData.length} repos
            </span>
          </header>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {projectsData.map((project, index) => (
              <article key={index} className="relative">
                {/* Card */}
                <div className="bg-gray-900/30 border border-green-500/20 rounded-lg sm:rounded-xl overflow-hidden">
                  {/* Terminal header bar */}
                  <header className="bg-gray-800/50 px-3 sm:px-4 py-2 border-b border-green-500/20 flex items-center space-x-2">
                    <div
                      className="flex space-x-1 sm:space-x-2"
                      aria-hidden="true"
                    >
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/60"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/60"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/60"></div>
                    </div>
                    <div className="flex-1 text-center overflow-hidden">
                      <span className="text-green-400/70 text-xs font-mono block truncate">
                        {project.name.toLowerCase().replace(/\s+/g, "-")}
                      </span>
                    </div>
                  </header>

                  {/* Project Image */}
                  <div className="relative h-40 sm:h-56 overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={`${project.name} - Full-stack web application screenshot`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
                  </div>

                  {/* Project Content */}
                  <div className="p-4 sm:p-8 space-y-3 sm:space-y-5">
                    <div className="flex items-start justify-between">
                      <h2 className="font-semibold text-green-400 text-base sm:text-xl mb-2 sm:mb-3 font-mono leading-tight">
                        {project.name}
                      </h2>
                    </div>

                    {/* Tech stack badges */}
                    <div
                      className="flex flex-wrap gap-1 sm:gap-2"
                      role="list"
                      aria-label="Technologies used"
                    >
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          role="listitem"
                          className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {project.description}
                    </p>

                    {/* Terminal command */}
                    <div className="bg-gray-800/50 rounded p-2 sm:p-4 font-mono text-xs sm:text-sm border border-gray-700/50 overflow-hidden">
                      <div className="flex items-center space-x-1 sm:space-x-2 text-green-400">
                        <span className="text-green-500 flex-shrink-0">$</span>
                        <span className="text-gray-400 flex-shrink-0">
                          git clone
                        </span>
                        <span className="text-blue-400 truncate min-w-0">
                          {project.githubUrl.split("/").pop()}.git
                        </span>
                      </div>
                    </div>

                    {/* Links Section */}
                    <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-gray-700/30 space-y-2 sm:space-y-0">
                      <nav
                        className="flex space-x-4 sm:space-x-6"
                        aria-label="Project links"
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 sm:space-x-2 text-gray-400 hover:text-green-400 font-mono text-sm sm:text-base"
                          aria-label={`View ${project.name} live demo`}
                        >
                          <ExternalLinkIcon />
                          <span>live</span>
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 sm:space-x-2 text-gray-400 hover:text-green-400 font-mono text-sm sm:text-base"
                          aria-label={`View ${project.name} source code on GitHub`}
                        >
                          <GitHubIcon />
                          <span>code</span>
                        </a>
                      </nav>

                      {/* Status indicator */}
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 text-xs font-mono">
                          active
                        </span>
                      </div>
                    </footer>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Summary footer */}
          <footer className="mt-8 sm:mt-12 border-t border-green-800/30 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-green-400/70 font-mono text-xs sm:text-sm space-y-2 sm:space-y-0">
              <span>Total projects: {projectsData.length}</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All repositories active</span>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
