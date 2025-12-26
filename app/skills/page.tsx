import { Metadata } from "next";
import type { ReactNode } from "react";

// Enhanced SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.morscode.site"),
  title: "Skills & Tech Stack | MERN Stack Developer",
  description:
    "Comprehensive technical skills of Anup Pradhan (Mors) including JavaScript, TypeScript, Python, React, Node.js, MongoDB, Express, Next.js, Docker, TensorFlow, and modern web development tools. Full-stack MERN developer from Bhubaneswar, India with AI/ML capabilities.",
  keywords: [
    "MERN Stack Skills",
    "JavaScript Developer",
    "TypeScript Expert",
    "React Developer",
    "Node.js Backend",
    "MongoDB Database",
    "Express.js API",
    "Next.js Framework",
    "Python Programming",
    "TensorFlow Machine Learning",
    "Docker Containers",
    "Full Stack Technologies",
    "Web Development Skills",
    "REST API Development",
    "Git Version Control",
    "Cloud Deployment Skills",
    "Full Stack Developer Bhubaneswar",
    "Full Stack Developer India",
    "AI ML Developer",
    "Machine Learning Skills",
  ],
  authors: [{ name: "Anup Pradhan (Mors)", url: "https://www.morscode.site" }],
  creator: "Anup Pradhan (Mors)",
  publisher: "Anup Pradhan (Mors)",
  openGraph: {
    title: "Skills & Tech Stack | MERN Stack Developer",
    description:
      "Expert in MERN stack, TypeScript, Python, AI/ML tools, and modern web development technologies. Full-stack developer from Bhubaneswar, India.",
    type: "website",
    url: "https://www.morscode.site/skills",
    siteName: "Anup Pradhan (Mors) - Developer Portfolio",
    locale: "en_IN",
    images: [
      {
        url: "https://www.morscode.site/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Anup Pradhan - Skills & Tech Stack",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AnupPradhan0",
    creator: "@AnupPradhan0",
    title: "Skills & Tech Stack | MERN Stack Developer",
    description:
      "Full-stack expertise in MERN, TypeScript, Python, and machine learning. Comprehensive technical skills portfolio.",
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
    canonical: "https://www.morscode.site/skills",
    languages: {
      en: "https://www.morscode.site/skills",
    },
  },
  category: "Technology",
  classification: "Skills Portfolio",
};

// Type definitions
interface SkillsCategory {
  languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  tools: string[];
  ai_ml: string[];
}

interface CategoryConfig {
  key: keyof SkillsCategory;
  title: string;
  icon: ReactNode;
  skills: string[];
}

// Skills data
const skillsData: SkillsCategory = {
  languages: [
    "JavaScript (ES6+)",
    "TypeScript",
    "Python",
    "C++",
    "HTML5",
    "CSS3",
  ],
  frontend: ["React", "Next.js", "Tailwind CSS", "EJS", "Vite"],
  backend: ["Node.js", "Express.js", "REST APIs"],
  databases: ["MongoDB", "Mongoose", "MongoDB Atlas"],
  tools: ["Git & GitHub", "Docker", "Postman", "Linux/CLI"],
  ai_ml: ["Cohere API", "TensorFlow (Basics)", "Pandas", "NumPy"],
};

// Terminal commands for each category
const terminalCommands: Record<keyof SkillsCategory, string> = {
  languages: "ls -la /skills/languages/",
  frontend: "cat /skills/frontend/stack.txt",
  backend: "ps aux | grep backend",
  databases: "show databases;",
  tools: "which --all tools",
  ai_ml: "python -m pip list | grep ai",
};

// Simplified SVG Icons
const CodeIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M8.7 15.9L4.8 12l3.9-3.9c.39-.39.39-1.01 0-1.4s-1.01-.39-1.4 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0 .39-.39.39-1.01 0-1.41zm6.6 0l3.9-3.9-3.9-3.9c-.39-.39-.39-1.01 0-1.4s1.01-.39 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6c-.39.39-1.01.39-1.4 0-.39-.39-.39-1.01 0-1.41z" />
  </svg>
);

const LayersIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z" />
  </svg>
);

const ServerIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M4 1h16c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2zm0 8h16c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2zm2 2v2h2v-2H6zm0-8v2h2V3H6zm12 8v2h2v-2h-2zm0-8v2h2V3h-2z" />
  </svg>
);

const DatabaseIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4zm0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z" />
  </svg>
);

const ToolIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
  </svg>
);

const BrainIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

// Enhanced JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anup Pradhan",
  alternateName: "Mors",
  url: "https://www.morscode.site",
  image: "https://www.morscode.site/images/logo.jpg",
  knowsAbout: [
    ...skillsData.languages,
    ...skillsData.frontend,
    ...skillsData.backend,
    ...skillsData.databases,
    ...skillsData.tools,
    ...skillsData.ai_ml,
  ],
  jobTitle: "Full Stack MERN Developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhubaneswar",
    addressRegion: "Odisha",
    addressCountry: "IN",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Programming Language",
      competencyRequired: "JavaScript, TypeScript, Python",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Web Development",
      competencyRequired: "React, Node.js, MongoDB, Express.js",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "DevOps & Tools",
      competencyRequired: "Git, Docker, Linux",
    },
  ],
  skills:
    "Full Stack Development, Backend Development, Frontend Development, Database Management, Machine Learning, AI Development",
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
      name: "Skills",
      item: "https://www.morscode.site/skills",
    },
  ],
};

// Lightweight Terminal Window Component
const TerminalWindow = ({
  title,
  command,
  icon,
  skills,
}: {
  title: string;
  command: string;
  icon: ReactNode;
  skills: string[];
}) => {
  return (
    <div itemScope itemType="https://schema.org/ItemList">
      {/* Terminal header */}
      <div>
        <div>
          <div aria-hidden="true">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span>
            ~ {title}
          </span>
        </div>
        <div aria-hidden="true"></div>
      </div>

      {/* Terminal content */}
      <div>
        {/* Command line */}
        <div>
          <span>$</span>
          <span>{command}</span>
        </div>

        {/* Skills output */}
        <div>
          <div>
            {icon}
            <span>
              {title.toLowerCase()}_modules:
            </span>
          </div>
          <div
            role="list"
            aria-label={`${title} skills`}
            itemProp="itemListElement"
          >
            {skills.map((skill) => (
              <span
                key={skill}
                role="listitem"
                itemProp="name"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Server Component - Lightweight Version
export default function Skills() {
  const categories: CategoryConfig[] = [
    {
      key: "languages",
      title: "Languages",
      icon: <CodeIcon />,
      skills: skillsData.languages,
    },
    {
      key: "frontend",
      title: "Frontend",
      icon: <LayersIcon />,
      skills: skillsData.frontend,
    },
    {
      key: "backend",
      title: "Backend",
      icon: <ServerIcon />,
      skills: skillsData.backend,
    },
    {
      key: "databases",
      title: "Databases",
      icon: <DatabaseIcon />,
      skills: skillsData.databases,
    },
    {
      key: "ai_ml",
      title: "AI/ML",
      icon: <BrainIcon />,
      skills: skillsData.ai_ml,
    },
    {
      key: "tools",
      title: "Tools",
      icon: <ToolIcon />,
      skills: skillsData.tools,
    },
  ];

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
        id="skills-section"
        aria-labelledby="skills-heading"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <div lang="en">
          {/* Header */}
          <header>
            <h1
              id="skills-heading"
              itemProp="name"
            >
              <span>&lt;</span>
              <span> Skills & Tech Stack </span>
              <span>/&gt;</span>
            </h1>
            <div>
              <span>$</span> ./skills --interactive --display-all
            </div>
          </header>

          {/* Terminal Windows Grid */}
          <div>
            {categories.map((category) => (
              <TerminalWindow
                key={category.key}
                title={category.title}
                command={terminalCommands[category.key]}
                icon={category.icon}
                skills={category.skills}
              />
            ))}
          </div>

          {/* Footer */}
          <footer>
            <p>
              <span>└─$</span>{" "}
              {skillsData.languages.length +
                skillsData.frontend.length +
                skillsData.backend.length +
                skillsData.databases.length +
                skillsData.tools.length +
                skillsData.ai_ml.length}{" "}
              total skills across {categories.length} categories
            </p>
          </footer>
        </div>
      </section>
    </>
  );
}
