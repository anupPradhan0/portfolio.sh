"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import TerminalComp from "@/components/TerminalComp";
import { useShell } from "@/context/ShellContext";

function HomeTerminal() {
  const searchParams = useSearchParams();
  const { setHideIdentityOnMobile } = useShell();
  const section = searchParams.get("section");
  const cmd = searchParams.get("cmd");

  const handleFirstCommand = (): void => {
    setHideIdentityOnMobile(true);
  };

  return (
    <TerminalComp
      onFirstCommand={handleFirstCommand}
      initialSection={section}
      initialCommand={cmd}
    />
  );
}

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anup Pradhan",
    jobTitle: "Software Engineer",
    description:
      "Software Engineer specializing in full-stack development and Next.js with backend focus and machine learning exploration",
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
      "https://www.linkedin.com/in/anuppradhan0",
      "https://github.com/anupPradhan0",
      "https://x.com/AnupPradhan0",
      "https://www.youtube.com/@mors.dev7",
      "https://www.instagram.com/anuppradhan.in",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.anuppradhan.in/#website",
    name: "Anup Pradhan",
    alternateName: "Anup Pradhan Portfolio",
    url: "https://www.anuppradhan.in",
    description:
      "Software Engineer portfolio showcasing projects, skills, experience, and a developer blog.",
    inLanguage: "en-IN",
    creator: {
      "@type": "Person",
      name: "Anup Pradhan",
      url: "https://www.anuppradhan.in",
    },
    publisher: {
      "@type": "Person",
      name: "Anup Pradhan",
      url: "https://www.anuppradhan.in",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.anuppradhan.in/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <HomeTerminal />
      </Suspense>
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
                meta.content = 'Software Engineer from Bhubaneswar, India. Specializing in backend development, RESTful APIs, React, Node.js, MongoDB, TypeScript, and exploring Machine Learning with TensorFlow.';
                document.head.appendChild(meta);
              }
            }
          `,
        }}
      />
    </>
  );
}
