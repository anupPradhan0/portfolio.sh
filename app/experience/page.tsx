import { Metadata } from "next";
import { durationLabel, formatMonths, monthsBetween } from "@/lib/duration";
import {
  OPEN_SOURCE_START,
  OPEN_SOURCE_END,
  CHATI_INTERN_START,
  CHATI_INTERN_END,
  CHATI_JR_START,
  CHATI_JR_END,
  PROMINDS_START,
  PROMINDS_END,
  PROMINDS_FULLSTACK_START,
  PROMINDS_FULLSTACK_END,
  PROMINDS_WORDPRESS_START,
  PROMINDS_WORDPRESS_END,
} from "@/lib/portfolio-data";

const SITE_URL = "https://www.anuppradhan.in";
const AUTHOR_NAME = "Anup Pradhan";


// Static page — re-render daily so durations stay fresh between deploys.
export const revalidate = 86400;

// SEO Metadata for Experience page
export const metadata: Metadata = {
  metadataBase: new URL("https://www.anuppradhan.in"),
  title: "Experience | Open Source SDE · PipesHub, Yuviz, Dograh",
  description:
    "Experience of Anup Pradhan: Open Source SDE (Sep 2026–Present) contributing to PipesHub, Yuviz, and Dograh; previously SDE-1 at Crunchy Media Pvt Ltd (Apr 2026–Aug 2026) on B2B AI Voice Calling with FreeSWITCH/WebRTC; part-time at Prominds Digital on AutoPulse CRM.",
  keywords: [
    "Anup Pradhan Experience",
    "Open Source SDE",
    "PipesHub",
    "Yuviz",
    "Dograh",
    "SDE-1",
    "SDE-1 Crunchy Media Pvt Ltd",
    "SDE Intern Crunchy Media Pvt Ltd",
    "Software Engineer Bhubaneswar",
    "AI Voice Calling SaaS",
    "FreeSWITCH Developer",
    "WebRTC Developer",
    "ESL Developer",
    "VoIP Engineer",
    "STT TTS LLM Pipeline",
    "AI Meeting Assistant",
    "AutoPulse CRM",
    "Prominds Digital",
    "Backend Developer India",
    "Data Pipeline Engineer",
    "Union-Find Deduplication",
    "RabbitMQ",
    "Bhubaneswar Software Engineer",
  ],
  authors: [{ name: "Anup Pradhan", url: "https://www.anuppradhan.in" }],
  creator: "Anup Pradhan",
  publisher: "Anup Pradhan",
  openGraph: {
    title: "Experience | Open Source SDE · PipesHub, Yuviz, Dograh",
    description:
      "Open Source SDE (Sep 2026–Present) on PipesHub, Yuviz, and Dograh. Previously SDE-1 at Crunchy Media Pvt Ltd — B2B AI Voice Calling on FreeSWITCH + WebRTC.",
    type: "profile",
    url: "https://www.anuppradhan.in/experience",
    siteName: "Anup Pradhan - Developer Portfolio",
    locale: "en_IN",
    images: [
      {
        url: "https://www.anuppradhan.in/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Anup Pradhan — Open Source SDE experience",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AnupPradhan0",
    creator: "@AnupPradhan0",
    title: "Experience | Open Source SDE · PipesHub, Yuviz, Dograh",
    description:
      "Open Source SDE contributing to PipesHub, Yuviz, and Dograh. Previously SDE-1 at Crunchy Media Pvt Ltd — AI Voice Calling on FreeSWITCH + WebRTC.",
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
    canonical: "https://www.anuppradhan.in/experience",
    languages: {
      en: "https://www.anuppradhan.in/experience",
    },
  },
  category: "Technology",
  classification: "Professional Experience",
};

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildStructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: SITE_URL,
    mainEntityOfPage: `${SITE_URL}/experience`,
    image: `${SITE_URL}/images/logo.jpg`,
    jobTitle: "Open Source SDE",
    hasOccupation: [
      {
        "@type": "EmployeeRole",
        roleName: "SDE",
        startDate: toIso(OPEN_SOURCE_START),
        worksFor: {
          "@type": "Organization",
          name: "Open Source",
        },
      },
      {
        "@type": "EmployeeRole",
        roleName: "SDE-1",
        startDate: toIso(CHATI_JR_START),
        endDate: toIso(CHATI_JR_END),
        worksFor: {
          "@type": "Organization",
          name: "Crunchy Media Pvt Ltd",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bhubaneswar",
            addressRegion: "Odisha",
            addressCountry: "IN",
          },
        },
      },
      {
        "@type": "EmployeeRole",
        roleName: "SDE Intern",
        startDate: toIso(CHATI_INTERN_START),
        endDate: toIso(CHATI_INTERN_END),
        worksFor: { "@type": "Organization", name: "Crunchy Media Pvt Ltd" },
      },
      {
        "@type": "EmployeeRole",
        roleName: "Part-time Developer",
        startDate: toIso(PROMINDS_START),
        worksFor: {
          "@type": "Organization",
          name: "Prominds Digital",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bhubaneswar",
            addressRegion: "Odisha",
            addressCountry: "IN",
          },
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/experience#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Experience",
        item: `${SITE_URL}/experience`,
      },
    ],
  };

  return { personSchema, breadcrumbSchema };
}

export default function Experience() {
  const { personSchema, breadcrumbSchema } = buildStructuredData();

  const openSourceTotal = durationLabel(OPEN_SOURCE_START, OPEN_SOURCE_END);
  const chatiTotal = durationLabel(CHATI_INTERN_START, CHATI_JR_END);
  const chatiJr = durationLabel(CHATI_JR_START, CHATI_JR_END);
  const chatiIntern = formatMonths(monthsBetween(CHATI_INTERN_START, CHATI_INTERN_END));
  const promindsTotal = durationLabel(PROMINDS_START, PROMINDS_END);
  const promindsFullstack = durationLabel(
    PROMINDS_FULLSTACK_START,
    PROMINDS_FULLSTACK_END
  );
  const promindsWordpress = durationLabel(
    PROMINDS_WORDPRESS_START,
    PROMINDS_WORDPRESS_END
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section
        id="experience-section"
        aria-labelledby="experience-heading"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <div lang="en">
          <header>
            <h1 id="experience-heading" itemProp="name">
              Experience
            </h1>
            <p>
              Professional roles as a Software Engineer — Open Source SDE
              contributing to PipesHub, Yuviz, and Dograh; previously at Crunchy
              Media Pvt Ltd architecting B2B AI Voice Calling SaaS on
              FreeSWITCH/WebRTC, and at Prominds Digital on scalable multi-tenant
              CRM for automotive dealerships.
            </p>
          </header>

          <div>
            {/* Open Source */}
            <article
              aria-labelledby="open-source-heading"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <header>
                <h2 id="open-source-heading" itemProp="name">
                  Open Source
                </h2>
                <p>
                  <strong>{openSourceTotal}</strong> · Remote
                </p>
              </header>

              <section aria-labelledby="open-source-sde-heading">
                <h3 id="open-source-sde-heading">SDE · Open Source</h3>
                <p>
                  <time dateTime={toIso(OPEN_SOURCE_START)}>Sep 2026</time> —{" "}
                  Present · {openSourceTotal}
                </p>
                <ul itemProp="description">
                  <li>
                    PipesHub: Contributing to the open-source enterprise context
                    layer for permissioned search, RAG, MCP, and agentic
                    workplace AI workflows.
                  </li>
                  <li>
                    Yuviz: Building on the voice AI stack — real-time STT → LLM
                    (tool-calling/RAG/transfer) → TTS over SIP and browser
                    testing.
                  </li>
                  <li>
                    Dograh: Contributing to the self-hosted open-source voice
                    agent platform (Vapi/Retell alternative) with workflow
                    builder, telephony, and MCP.
                  </li>
                </ul>
              </section>
            </article>

            {/* Crunchy Media Pvt Ltd */}
            <article
              aria-labelledby="chati-heading"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <header>
                <h2 id="chati-heading" itemProp="name">
                  Crunchy Media Pvt Ltd
                </h2>
                <p>
                  <strong>{chatiTotal}</strong> · Bhubaneswar, Odisha, India ·
                  On-site
                </p>
              </header>

              {/* SDE-1 */}
              <section aria-labelledby="chati-jr-heading">
                <h3 id="chati-jr-heading">
                  SDE-1 · Full-time
                </h3>
                <p>
                  <time dateTime={toIso(CHATI_JR_START)}>Apr 2026</time> —{" "}
                  <time dateTime={toIso(CHATI_JR_END)}>Aug 2026</time> · {chatiJr}
                </p>
                <ul itemProp="description">
                  <li>
                    Product Leadership: Serving as lead developer architecting a
                    B2B AI Voice Calling SaaS platform for automated inbound and
                    outbound voice systems.
                  </li>
                  <li>
                    Telephony Infrastructure: Engineering high-availability VoIP
                    infrastructure using FreeSWITCH, ESL, and WebRTC to
                    orchestrate real-time, low-latency audio streaming.
                  </li>
                  <li>
                    Voice AI Pipeline: Integrating low-latency STT, LLM
                    orchestration, and TTS pipelines to deliver human-like
                    conversational responses during live calls.
                  </li>
                </ul>
              </section>

              {/* SDE Intern */}
              <section aria-labelledby="chati-intern-heading">
                <h3 id="chati-intern-heading">
                  SDE Intern · Internship
                </h3>
                <p>
                  <time dateTime={toIso(CHATI_INTERN_START)}>Oct 2025</time> —{" "}
                  <time dateTime={toIso(CHATI_INTERN_END)}>Mar 2026</time> ·{" "}
                  {chatiIntern}
                </p>
                <ul itemProp="description">
                  <li>
                    AI Meeting Assistant: Built an AI assistant for Zoom, Teams,
                    and Google Meet that automates recording and transcript
                    summaries for 500+ active users.
                  </li>
                  <li>
                    High-Performance Pipeline: Engineered a batch-processing
                    system that cleaned, validated, and migrated 1.2M+ records
                    into production in under 10 minutes.
                  </li>
                  <li>
                    Algorithmic Deduplication: Designed a Union–Find based
                    clustering system to deduplicate related records in near
                    O(1) time per link.
                  </li>
                </ul>
              </section>
            </article>

            {/* Prominds Digital */}
            <article
              aria-labelledby="prominds-heading"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <header>
                <h2 id="prominds-heading" itemProp="name">
                  Prominds Digital
                </h2>
                <p>
                  <strong>{promindsTotal}</strong> · Bhubaneswar, Odisha, India
                </p>
              </header>

              <section aria-labelledby="prominds-fullstack-heading">
                <h3 id="prominds-fullstack-heading">Full Stack Developer</h3>
                <p>
                  <time dateTime={toIso(PROMINDS_FULLSTACK_START)}>Nov 2025</time> —{" "}
                  <time dateTime={toIso(PROMINDS_FULLSTACK_END)}>Apr 2026</time> · {promindsFullstack}{" "}
                  Hybrid
                </p>
                <ul itemProp="description">
                  <li>
                    Developed an automotive visitor management SaaS used by 5
                    dealerships (5k+ monthly entries) featuring WhatsApp
                    automation and lead pipelines.
                  </li>
                  <li>
                    Managing the architectural shift and migration of legacy
                    infrastructure to a modern, streamlined CRM solution.
                  </li>
                </ul>
              </section>

              <section aria-labelledby="prominds-wordpress-heading">
                <h3 id="prominds-wordpress-heading">WordPress Developer</h3>
                <p>
                  <time dateTime={toIso(PROMINDS_WORDPRESS_START)}>Apr 2025</time> —{" "}
                  <time dateTime={toIso(PROMINDS_WORDPRESS_END)}>Nov 2025</time> · {promindsWordpress}{" "}
                  Remote
                </p>
                <ul itemProp="description">
                  <li>
                    Launched 5 WordPress websites and optimized performance
                    scores by 50% (achieving a peak score of 84).
                  </li>
                </ul>
              </section>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

