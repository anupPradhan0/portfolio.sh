import { Metadata } from "next";

// Enhanced SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.anuppradhan.in"),
  title: "About Me | Software Developer & Machine Learning Enthusiast",
  description:
    "Experienced Software Developer from Bhubaneswar, India specializing in backend development, RESTful APIs, MongoDB, Express.js, React, Node.js, and TypeScript. Currently expanding skills in Machine Learning with TensorFlow and scikit-learn. Building production-ready applications with JWT authentication and cloud deployment. Pursuing BCA at Amity University with CGPA 8.93.",
  keywords: [
    "Software Developer",
    "Software Developer Bhubaneswar",
    "Software Developer India",
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
    title: "About Me | Software Developer & Machine Learning Enthusiast",
    description:
      "Software Developer from Bhubaneswar, India specializing in backend development, RESTful APIs, and full-stack applications. Learning Machine Learning and sharing my journey through content creation. Pursuing BCA at Amity University.",
    type: "profile",
    url: "https://www.anuppradhan.in/about",
    siteName: "Anup Pradhan - Developer Portfolio",
    locale: "en_IN",
    images: [
      {
        url: "https://www.anuppradhan.in/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Anup Pradhan - Software Developer & Machine Learning Enthusiast",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AnupPradhan0",
    creator: "@AnupPradhan0",
    title: "About Me | Software Developer & Machine Learning Enthusiast",
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

const YoutubeIcon = () => (
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
    aria-label="YouTube icon"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

// Enhanced JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anup Pradhan",
  url: "https://www.anuppradhan.in",
  image: "https://www.anuppradhan.in/images/logo.jpg",
  jobTitle: "Software Developer",
  description:
    "Software Developer from Bhubaneswar, India specializing in backend development, RESTful APIs, and machine learning. Currently pursuing BCA at Amity University.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhubaneswar",
    addressRegion: "Odisha",
    addressCountry: "IN",
  },
  knowsAbout: [
    "MongoDB",
    "Express.js",
    "React",
    "Node.js",
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
    "Next.js",
    "Python",
    "scikit-learn",
    "NumPy",
    "pandas",
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Amity University",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
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
    "Software Development, Backend Development, API Development, Machine Learning, MongoDB, Express.js, React, Node.js, TypeScript, Python, TensorFlow",
  sameAs: ["https://twitter.com/AnupPradhan0"],
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
                  I&apos;m a <strong>Software Developer</strong> with a
                  backend focus, building reliable RESTful APIs and full‑stack
                  applications using MongoDB, Express.js, React, Node.js, and
                  TypeScript, with JWT‑based authentication and responsive
                  interfaces in React, Tailwind, HTML/CSS, and EJS. Strong in
                  data modeling with Mongoose, media handling via Cloudinary
                  integration (storage/CDN), and pragmatic tooling across
                  Git/GitHub, Docker, Postman, and API testing for robust
                  delivery. Comfortable augmenting products with AI/ML libraries
                  (TensorFlow, NumPy, pandas) and shipping to Vercel/Render,
                  guided by a build‑to‑learn mindset and ongoing BCA studies
                  (CGPA 8.93).
                </p>

                <div role="list" aria-label="Technical skills">
                  {[
                    "MongoDB",
                    "Express",
                    "React",
                    "Node.js",
                    "JavaScript",
                    "TypeScript",
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

            {/* Skills Section */}
            <section id="skills-section" aria-labelledby="skills-heading">
              <div>
                <span>$</span>
                <h2 id="skills-heading">What I&apos;m Doing</h2>
              </div>

              <div>
                {/* Machine Learning Card */}
                <article>
                  <div>
                    <CodeIcon />
                  </div>
                  <h3>Learning Machine Learning</h3>
                  <p>
                    Driven by a deep passion for technology&apos;s potential, I
                    am on an exciting and immersive journey into the field of
                    machine learning. My current focus is on building hands-on
                    projects to deepen my understanding of the entire ML
                    pipeline, from data preprocessing to model deployment. I am
                    mastering essential tools like scikit-learn and TensorFlow
                    to build and refine models, with the ultimate goal of
                    creating elegant and effective solutions to real-world
                    challenges.
                  </p>
                </article>

                {/* YouTube Card */}
                <article>
                  <div>
                    <YoutubeIcon />
                  </div>
                  <h3>Content Creation</h3>
                  <p>
                    Beyond coding, I am passionate about sharing my experiences.
                    Once a month, I create and upload a video that offers a look
                    into my life as a developer—from the technical challenges of
                    a new project to the personal lessons learned along the way.
                    My goal is to build in public and share my process with the
                    community.
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
