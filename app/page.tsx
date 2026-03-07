"use client";

import { useState } from "react";
import Script from "next/script";
import Tag from "@/components/Tag";
import TerminalComp from "@/components/TerminalComp";

export default function Home() {
  const [firstCommandExecuted, setFirstCommandExecuted] =
    useState<boolean>(false);

  const handleFirstCommand = (): void => {
    setFirstCommandExecuted(true);
  };

  // Structured Data - Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anup Pradhan",
    jobTitle: "Software Developer",
    description:
      "Software developer specializing in full-stack development and Next.js with backend focus and machine learning exploration",
    image: "https://www.anuppradhan.in/images/logo.jpg",
    email: "anuppradhan929@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bhubaneswar",
      addressRegion: "Odisha",
      addressCountry: "India",
    },
    knowsAbout: [
      "MongoDB",
      "Express.js",
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "JavaScript",
      "Python",
      "Machine Learning",
      "TensorFlow",
      "REST APIs",
      "Docker",
      "Git",
      "Backend Development",
      "Software Development",
    ],
    sameAs: [
      "https://www.linkedin.com/in/anup-pradhan77",
      "https://github.com/anupPradhan0",
      "https://x.com/AnupPradhan0",
      "https://www.youtube.com/@morscode7",
      "https://www.instagram.com/mors.365/",
      "https://leetcode.com/u/Anuppradhan/",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Amity University",
      sameAs: "https://www.amity.edu/",
    },
    workLocation: {
      "@type": "Place",
      name: "Bhubaneswar, Odisha, India",
    },
    url: "https://www.anuppradhan.in/",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.anuppradhan.in/",
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.anuppradhan.in",
      },
    ],
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Anup Pradhan Portfolio",
    url: "https://www.anuppradhan.in",
    description:
      "Software Developer portfolio showcasing projects, skills, and experience",
    creator: {
      "@type": "Person",
      name: "Anup Pradhan",
    },
  };

  return (
    <>
      {/* Structured Data - Person Schema */}
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        strategy="afterInteractive"
      />

      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="afterInteractive"
      />

      {/* Website Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        strategy="afterInteractive"
      />

      <main className="app-shell" role="main">
        <div className="main-content-area">
          {/* Identity Card Section */}
          <section
            className={`identity-pane border-2 border-green-400 ${
              firstCommandExecuted ? "hide-on-mobile" : ""
            }`}
            aria-label="Developer Identity Card - Anup Pradhan Software Developer specializing in backend development and machine learning"
          >
            <Tag />
          </section>

          {/* Terminal Section */}
          <section
            className="terminal-pane"
            aria-label="Interactive Terminal - Explore skills, projects, and experience with commands"
          >
            <TerminalComp onFirstCommand={handleFirstCommand} />
          </section>
        </div>
      </main>

      {/* Meta description for SEO - rendered via Next.js Head in layout */}
      <Script
        id="seo-meta-tags"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              const metaDescription = document.querySelector('meta[name="description"]');
              if (!metaDescription) {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = 'Software Developer from Bhubaneswar, India. Specializing in backend development, RESTful APIs, React, Node.js, MongoDB, TypeScript, and exploring Machine Learning with TensorFlow.';
                document.head.appendChild(meta);
              }
            }
          `,
        }}
      />
    </>
  );
}
