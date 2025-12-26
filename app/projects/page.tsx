import { Metadata } from "next";
import Image from "next/image";

// Enhanced SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.morscode.site"),
  title: "Projects | Full-Stack MERN Developer Portfolio",
  description:
    "Explore Anup Pradhan's (Mors) portfolio of full-stack web applications including WhatsApp Campaign Management, AI-powered finance tracker, neural networks, and more. Built with MERN stack, TypeScript, Python, and modern web technologies. All projects are open-source and available on GitHub.",
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
    "Next.js Projects",
    "Open Source Projects",
    "GitHub Portfolio",
  ],
  authors: [{ name: "Anup Pradhan (Mors)", url: "https://www.morscode.site" }],
  creator: "Anup Pradhan (Mors)",
  publisher: "Anup Pradhan (Mors)",
  openGraph: {
    title: "Projects | Full-Stack MERN Developer Portfolio",
    description:
      "Portfolio showcasing full-stack web applications, AI projects, and machine learning implementations by Anup Pradhan (Mors). Built with MERN stack, TypeScript, and Python. All projects open-source on GitHub.",
    type: "website",
    url: "https://www.morscode.site/projects",
    siteName: "Anup Pradhan (Mors) - Developer Portfolio",
    locale: "en_IN",
    images: [
      {
        url: "https://www.morscode.site/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Anup Pradhan - Full-Stack MERN Developer Projects Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AnupPradhan0",
    creator: "@AnupPradhan0",
    title: "Projects | Full-Stack MERN Developer Portfolio",
    description:
      "Full-stack MERN projects, AI applications, and machine learning implementations. All projects open-source on GitHub.",
    images: ["https://www.morscode.site/images/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.morscode.site/projects",
    languages: {
      en: "https://www.morscode.site/projects",
    },
  },
  category: "Technology",
  classification: "Portfolio",
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
  name: "Full-Stack Development Projects Portfolio",
  description:
    "Portfolio of MERN stack, AI, and machine learning projects by Anup Pradhan (Mors)",
  author: {
    "@type": "Person",
    name: "Anup Pradhan",
    alternateName: "Mors",
    url: "https://www.morscode.site",
  },
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
      codeRepository: project.githubUrl,
      programmingLanguage: project.tech,
      creator: {
        "@type": "Person",
        name: "Anup Pradhan",
        alternateName: "Mors",
      },
    },
  })),
};

// Breadcrumb Structured Data
const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.morscode.site",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Projects",
      item: "https://www.morscode.site/projects",
    },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <section
        id="projects-section"
        aria-labelledby="projects-heading"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <div lang="en">
          {/* Header */}
          <header>
            <TerminalIcon />
            <h1 id="projects-heading" itemProp="name">
              Projects
            </h1>
            <span>{projectsData.length} repos</span>
          </header>

          {/* Projects Grid */}
          <div>
            {projectsData.map((project, index) => (
              <article
                key={index}
                aria-labelledby={`project-${index}-title`}
                itemScope
                itemType="https://schema.org/SoftwareApplication"
              >
                {/* Card */}
                <div>
                  {/* Terminal header bar */}
                  <header>
                    <div aria-hidden="true">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div>
                      <span>
                        {project.name.toLowerCase().replace(/\s+/g, "-")}
                      </span>
                    </div>
                  </header>

                  {/* Project Image */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "300px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={project.imageUrl}
                      alt={`${project.name} - Full-stack web application screenshot`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      priority
                      loading="eager"
                    />
                  </div>

                  {/* Project Content */}
                  <div>
                    <div>
                      <h2 id={`project-${index}-title`} itemProp="name">
                        {project.name}
                      </h2>
                    </div>

                    {/* Tech stack badges */}
                    <div role="list" aria-label="Technologies used">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          role="listitem"
                          itemProp="programmingLanguage"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <p itemProp="description">{project.description}</p>

                    {/* Terminal command */}
                    <div>
                      <div>
                        <span>$</span>
                        <span>git clone</span>
                        <span>{project.githubUrl.split("/").pop()}.git</span>
                      </div>
                    </div>

                    {/* Links Section */}
                    <footer>
                      <nav aria-label="Project links">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.name} live demo`}
                          itemProp="url"
                        >
                          <ExternalLinkIcon />
                          <span>live</span>
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.name} source code on GitHub`}
                          itemProp="codeRepository"
                        >
                          <GitHubIcon />
                          <span>code</span>
                        </a>
                      </nav>

                      {/* Status indicator */}
                      <div>
                        <div></div>
                        <span>active</span>
                      </div>
                    </footer>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Summary footer */}
          <footer>
            <div>
              <span>Total projects: {projectsData.length}</span>
              <div>
                <div></div>
                <span>All repositories active</span>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
