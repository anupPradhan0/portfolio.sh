import React from "react";
import Image from "next/image";
import { PaneHeader } from "@/components/TerminalComp/ui";

const TECH = ["MongoDB", "Express", "React", "Node.js", "JavaScript", "TypeScript"];

const EDUCATION = [
  {
    school: "Amity University",
    years: "2024 — 2027",
    note: "Doing my Bachelors of Computer Application (BCA). CGPA: 8.93",
  },
  {
    school: "Autonomous College Khariar",
    years: "2022 — 2024",
    note: "I did my 11th and 12th in I.T.",
  },
  {
    school: "High School",
    years: "2009 — 2022",
    note: "I did my schooling from our village school.",
  },
];

const OPENPING_TAGS = ["Broadcasts", "Shared inbox", "Contacts", "Templates", "Open source"];

const About: React.FC = () => (
  <div className="pane">
    <PaneHeader
      title="~/about"
      aside={<span className="pane-status">Ready for new challenges</span>}
    />

    <section className="pane-section">
      <p>
        I&apos;m a <strong className="pane-strong">Software Engineer</strong> with a
        backend focus, building reliable RESTful APIs and full‑stack applications
        using MongoDB, Express.js, React, Node.js, and TypeScript, with JWT‑based
        auth and responsive interfaces in React, Tailwind, HTML/CSS, and EJS.
        Strong in data modeling with Mongoose, media handling via Cloudinary
        integration (storage/CDN, not a database), and pragmatic tooling across
        Git/GitHub, Docker, Postman, and API testing for robust delivery.
        Comfortable augmenting products with AI/ML libraries (TensorFlow, NumPy,
        pandas) and shipping to Vercel/Render, guided by a build‑to‑learn mindset
        and ongoing BCA studies (CGPA 8.93).
      </p>
      <div className="pane-tags">
        {TECH.map((tech) => (
          <span key={tech} className="pane-tag">
            {tech}
          </span>
        ))}
      </div>
    </section>

    <section className="pane-section">
      <h3 className="pane-subtitle">current focus</h3>

      <div>
        <h4 className="pane-item-title">Open-source contributor</h4>
        <p>
          Contributing to{" "}
          <a href="https://pipeshub.com/" target="_blank" rel="noopener noreferrer" className="pane-link">
            PipesHub
          </a>
          , an enterprise context layer for permissioned search, RAG, and agentic
          workflows, and{" "}
          <a href="https://openping.in" target="_blank" rel="noopener noreferrer" className="pane-link">
            OpenPing
          </a>
          , a WhatsApp messaging platform.
        </p>
      </div>

      <div className="pane-card pane-feature">
        <div className="pane-media">
          <Image
            src="/images/openping-project.png"
            alt="OpenPing: every WhatsApp conversation, in one place"
            fill
            sizes="(max-width: 640px) 100vw, 280px"
            className="object-cover"
          />
        </div>
        <div className="pane-stack">
          <h4 className="pane-item-title">OpenPing</h4>
          <p>
            OpenPing is a WhatsApp messaging platform built on the official Meta
            WhatsApp Business Cloud API, providing businesses with a centralized
            dashboard to manage contacts, message templates, and automated
            WhatsApp communication.
          </p>
          <div className="pane-tags">
            {OPENPING_TAGS.map((tag) => (
              <span key={tag} className="pane-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="pane-section">
      <h3 className="pane-subtitle">education</h3>
      <ol className="pane-timeline">
        {EDUCATION.map((item) => (
          <li key={item.school}>
            <div className="pane-spread">
              <h4 className="pane-item-title">{item.school}</h4>
              <span className="pane-meta">{item.years}</span>
            </div>
            <p>{item.note}</p>
          </li>
        ))}
      </ol>
    </section>
  </div>
);

export default About;
