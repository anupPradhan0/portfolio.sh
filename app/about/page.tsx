import { Metadata } from "next";

// Enhanced SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.anuppradhan.in"),
  title: "About Me | Software Engineer & Machine Learning Enthusiast",
  description:
    "Experienced Software Engineer from Bhubaneswar, India specializing in backend development, RESTful APIs, MongoDB, Express.js, React, Node.js, and TypeScript. Currently expanding skills in Machine Learning with TensorFlow and scikit-learn. Building production-ready applications with JWT authentication and cloud deployment. Pursuing BCA at Amity University with CGPA 8.93.",
  keywords: [
    "Software Engineer",
    "Software Engineer Bhubaneswar",
    "Software Engineer India",
    "Backend Developer",
    "MongoDB Developer",
    "Express.js Developer",
    "React Developer",
    "Node.js Developer",
    "TypeScript Developer",
    "Machine Learning Developer",
    "Machine Learning",
    "TensorFlow",
    "RESTful API Development",
    "JWT Authentication",
    "Tailwind CSS",
    "Docker",
    "Cloud Deployment",
    "Amity University BCA",
    "Web Developer India",
    "API Development",
    "Next.js Developer",
    "Python Developer",
    "Developer Portfolio",
    "Freelance Developer",
  ],
  authors: [{ name: "Anup Pradhan", url: "https://www.anuppradhan.in" }],
  creator: "Anup Pradhan",
  publisher: "Anup Pradhan",
  openGraph: {
    title: "About Me | Software Engineer & Machine Learning Enthusiast",
    description:
      "Software Engineer from Bhubaneswar, India specializing in backend development, RESTful APIs, and full-stack applications. Learning Machine Learning and sharing my journey through content creation. Pursuing BCA at Amity University.",
    type: "profile",
    url: "https://www.anuppradhan.in/about",
    siteName: "Anup Pradhan - Developer Portfolio",
    locale: "en_IN",
    images: [
      {
        url: "https://www.anuppradhan.in/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Anup Pradhan - Software Engineer & Machine Learning Enthusiast",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AnupPradhan0",
    creator: "@AnupPradhan0",
    title: "About Me | Software Engineer & Machine Learning Enthusiast",
    description:
      "Full-stack MERN developer from Bhubaneswar, India focused on backend development and machine learning. Pursuing BCA at Amity University.",
    images: ["https://www.anuppradhan.in/images/logo.jpg"],
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
    canonical: "https://www.anuppradhan.in/about",
    languages: {
      en: "https://www.anuppradhan.in/about",
    },
  },
  category: "Technology",
  classification: "Developer Portfolio",
};

// Simplified SVG Icons
const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Code icon"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const SystemIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="System design icon"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Enhanced JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.anuppradhan.in/#person",
  name: "Anup Pradhan",
  givenName: "Anup",
  familyName: "Pradhan",
  url: "https://www.anuppradhan.in",
  mainEntityOfPage: "https://www.anuppradhan.in/about",
  image: "https://www.anuppradhan.in/images/logo.jpg",
  email: "mailto:anuppradhan929@gmail.com",
  jobTitle: "SDE-1",
  description:
    "SDE-1 at Crunchy Media Pvt Ltd working on AI-powered calling software with WebRTC and SIP. Backend-focused full-stack engineer from Bhubaneswar, India; also a part-time Full Stack / WordPress developer at Prominds Digital. Currently pursuing BCA at Amity University.",
  worksFor: [
    { "@type": "Organization", name: "Crunchy Media Pvt Ltd" },
    { "@type": "Organization", name: "Prominds Digital" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhubaneswar",
    addressRegion: "Odisha",
    addressCountry: "IN",
  },
  nationality: { "@type": "Country", name: "India" },
  knowsLanguage: ["English", "Hindi", "Odia"],
  knowsAbout: [
    "Software Development",
    "Backend Development",
    "Full Stack Development",
    "AI Calling",
    "WebRTC",
    "SIP",
    "Real-time Voice",
    "MongoDB",
    "Express.js",
    "React",
    "Node.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Machine Learning",
    "TensorFlow",
    "RESTful API",
    "JWT Authentication",
    "Tailwind CSS",
    "Docker",
    "Git",
    "Cloudinary",
    "Vercel",
    "Render",
    "Python",
    "scikit-learn",
    "NumPy",
    "pandas",
    "System Design",
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Amity University",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
    },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      educationalLevel: "Bachelor's Degree",
      about: "Bachelor of Computer Application (BCA)",
      recognizedBy: {
        "@type": "EducationalOrganization",
        name: "Amity University",
      },
    },
  ],
  skills:
    "Software Development, Backend Development, AI Calling, WebRTC, SIP, API Development, Machine Learning, MongoDB, Express.js, React, Node.js, Next.js, TypeScript, Python",
  sameAs: [
    "https://github.com/anupPradhan0",
    "https://www.linkedin.com/in/anuppradhan0",
    "https://x.com/AnupPradhan0",
    "https://twitter.com/AnupPradhan0",
    "https://www.instagram.com/anuppradhan.in",
    "https://www.youtube.com/@mors.dev7",
    "https://leetcode.com/u/Anuppradhan/",
  ],
};

// AboutPage Structured Data — wraps the Person and is the page's primary entity
const aboutPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://www.anuppradhan.in/about#aboutpage",
  url: "https://www.anuppradhan.in/about",
  name: "About Anup Pradhan",
  description:
    "About Anup Pradhan — SDE-1 at Crunchy Media Pvt Ltd working on AI calling (WebRTC + SIP), part-time at Prominds Digital, and currently learning system design and automation.",
  inLanguage: "en-IN",
  mainEntity: { "@id": "https://www.anuppradhan.in/#person" },
  author: { "@id": "https://www.anuppradhan.in/#person" },
  about: { "@id": "https://www.anuppradhan.in/#person" },
  primaryImageOfPage: "https://www.anuppradhan.in/images/logo.jpg",
  isPartOf: { "@id": "https://www.anuppradhan.in/#website" },
  breadcrumb: {
    "@id": "https://www.anuppradhan.in/about#breadcrumb",
  },
  datePublished: "2025-03-01",
  dateModified: new Date().toISOString().slice(0, 10),
};

// Breadcrumb Structured Data
const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://www.anuppradhan.in/about#breadcrumb",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.anuppradhan.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: "https://www.anuppradhan.in/about",
    },
  ],
};

// Main Server Component - Lightweight Version
export default function About() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageStructuredData),
        }}
      />
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

      <div lang="en">
        {/* Main content */}
        <main>
          {/* Header */}
          <header>
            <h1 itemProp="name">About Me</h1>
            <p>
              By{" "}
              <a
                href="https://www.anuppradhan.in"
                rel="author"
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
              >
                <span itemProp="name">Anup Pradhan</span>
              </a>
              {" · "}
              <span itemProp="jobTitle">SDE-1</span> @{" "}
              <span itemProp="worksFor">Crunchy Media Pvt Ltd</span>
              {" · "}
              <a href="mailto:anuppradhan929@gmail.com" rel="me">
                anuppradhan929@gmail.com
              </a>
            </p>
          </header>

          <div>
            {/* About Me Section */}
            <section id="about-section" aria-labelledby="about-heading">
              <div>
                <span>$</span>
                <h2 id="about-heading">About Me</h2>
              </div>

              <div>
                <p>
                  I&apos;m a <strong>Software Engineer</strong> at
                  Crunchy Media Pvt Ltd, working on AI-powered calling software built on{" "}
                  <strong>WebRTC</strong> and the <strong>SIP</strong> protocol
                  — real-time voice flows, media negotiation, signaling, and
                  integrating the AI agent into live calls. Backend-focused
                  full-stack engineer: reliable RESTful APIs and full‑stack
                  applications on MongoDB, Express.js, React, Node.js, Next.js,
                  and TypeScript, with JWT auth and responsive UIs in Tailwind.
                  Strong on data modeling (Mongoose), media handling
                  (Cloudinary), and pragmatic tooling (Git, Docker, Postman).
                  Also part-time at Prominds Digital as Full Stack / WordPress
                  developer. Comfortable augmenting products with AI/ML
                  libraries (TensorFlow, NumPy, pandas) and shipping to
                  Vercel/Render. Pursuing BCA at Amity University (CGPA 8.93).
                </p>

                <div role="list" aria-label="Technical skills">
                  {[
                    "WebRTC",
                    "SIP",
                    "Node.js",
                    "TypeScript",
                    "Next.js",
                    "MongoDB",
                    "Express",
                    "React",
                  ].map((tech) => (
                    <span key={tech} role="listitem">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section id="education-section" aria-labelledby="education-heading">
              <div>
                <span>$</span>
                <h2 id="education-heading">Education</h2>
              </div>

              <div
                itemScope
                itemType="https://schema.org/EducationalOccupationalCredential"
              >
                {/* Amity University */}
                <article
                  aria-labelledby="amity-heading"
                  itemScope
                  itemType="https://schema.org/EducationalOrganization"
                >
                  <div>
                    <h3 id="amity-heading" itemProp="name">
                      Amity University
                    </h3>
                    <time dateTime="2024/2027" itemProp="temporalCoverage">
                      2024 — 2027
                    </time>
                  </div>
                  <p itemProp="description">
                    Pursuing Bachelor of Computer Application (BCA) with strong
                    academic performance.
                  </p>
                  <div>
                    <span itemProp="credentialCategory">CGPA: 8.93</span>
                  </div>
                </article>

                {/* Autonomous College Khariar */}
                <article
                  aria-labelledby="ack-heading"
                  itemScope
                  itemType="https://schema.org/EducationalOrganization"
                >
                  <div>
                    <h3 id="ack-heading" itemProp="name">
                      Autonomous College Khariar
                    </h3>
                    <time dateTime="2022/2024" itemProp="temporalCoverage">
                      2022 — 2024
                    </time>
                  </div>
                  <p itemProp="description">
                    Completed higher secondary education (11th and 12th grade)
                    specializing in Information Technology.
                  </p>
                </article>

                {/* High School */}
                <article
                  aria-labelledby="highschool-heading"
                  itemScope
                  itemType="https://schema.org/EducationalOrganization"
                >
                  <div>
                    <h3 id="highschool-heading" itemProp="name">
                      High School
                    </h3>
                    <time dateTime="2009/2022" itemProp="temporalCoverage">
                      2009 — 2022
                    </time>
                  </div>
                  <p itemProp="description">
                    Completed primary and secondary education, building
                    foundational knowledge.
                  </p>
                </article>
              </div>
            </section>

            {/* Current focus */}
            <section id="focus-section" aria-labelledby="focus-heading">
              <div>
                <span>$</span>
                <h2 id="focus-heading">What I&apos;m Doing</h2>
              </div>

              <div>
                {/* SDE-1 @ Crunchy Media Pvt Ltd */}
                <article>
                  <div>
                    <CodeIcon />
                  </div>
                  <h3>SDE-1 @ Crunchy Media Pvt Ltd</h3>
                  <p>
                    Working on AI-powered calling software, building real-time
                    voice flows on top of <strong>WebRTC</strong> and the{" "}
                    <strong>SIP</strong> protocol. Day-to-day is hands-on with
                    media negotiation, signaling, and integrating the AI agent
                    into the live call pipeline.
                  </p>
                </article>

                {/* System Design & Automation */}
                <article>
                  <div>
                    <SystemIcon />
                  </div>
                  <h3>System Design &amp; Automation</h3>
                  <p>
                    Studying <strong>system design</strong> and architecture
                    patterns, refactoring older projects to apply what I learn,
                    and building small automation tools to remove repetitive
                    work from my day-to-day flow.
                  </p>
                </article>
              </div>
            </section>

            {/* Status footer */}
            <footer>
              <div>
                <span>Status: Ready for new challenges</span>
                <span>Online</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
