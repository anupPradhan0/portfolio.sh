import React from "react";

const TECH = ["MongoDB", "Express", "React", "Node.js", "JavaScript", "TypeScript"];

const EDUCATION = [
  {
    school: "Amity University",
    years: "2024 — 2027",
    note: "Doing my Bachelors of Computer Application (BCA).",
    grade: "CGPA: 8.93",
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

const About: React.FC = () => (
  <div className="pane">
    <header className="pane-header">
      <h2 className="pane-title">~/about</h2>
      <span className="pane-status">Ready for new challenges</span>
    </header>

    <section className="pane-section">
      <p>
        I&apos;m a <span className="text-green-400 font-semibold">Software Engineer</span>{" "}
        with a backend focus, building reliable RESTful APIs and full‑stack
        applications using MongoDB, Express.js, React, Node.js, and TypeScript,
        with JWT‑based auth and responsive interfaces in React, Tailwind,
        HTML/CSS, and EJS. Strong in data modeling with Mongoose, media handling
        via Cloudinary integration (storage/CDN, not a database), and pragmatic
        tooling across Git/GitHub, Docker, Postman, and API testing for robust
        delivery. Comfortable augmenting products with AI/ML libraries
        (TensorFlow, NumPy, pandas) and shipping to Vercel/Render, guided by a
        build‑to‑learn mindset and ongoing BCA studies (CGPA 8.93).
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
      <h3 className="pane-subtitle">Education</h3>
      <div className="pane-card">
        {EDUCATION.map((item, i) => (
          <div
            key={item.school}
            className={i > 0 ? "border-t border-green-800/40 pt-3 mt-1" : undefined}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h4 className="pane-item-title">{item.school}</h4>
              <span className="pane-meta">{item.years}</span>
            </div>
            <p className="mt-1">{item.note}</p>
            {item.grade && <span className="pane-tag inline-block mt-2">{item.grade}</span>}
          </div>
        ))}
      </div>
    </section>

    <section className="pane-section">
      <h3 className="pane-subtitle">Current focus</h3>
      <div className="pane-grid">
        <div className="pane-card">
          <h4 className="pane-item-title">
            Open-source contributor — PipesHub, Dograh, personal projects
          </h4>
          <p>
            Focusing on open-source contributions: building integrations and
            backend tooling for{" "}
            <a href="https://pipeshub.com/" target="_blank" rel="noopener noreferrer" className="pane-link">
              PipesHub
            </a>
            , authoring automation libraries for{" "}
            <a href="https://dograh.com/" target="_blank" rel="noopener noreferrer" className="pane-link">
              Dograh
            </a>
            , and maintaining several personal repositories aimed at developer
            ergonomics and infra automation.
          </p>
        </div>
        <div className="pane-card">
          <h4 className="pane-item-title">System Design, DSA &amp; Automation</h4>
          <p>
            Focused on system design, data structures &amp; algorithms (DSA), and
            core fundamentals. Practicing problem solving, studying architecture
            patterns, and applying learnings by refactoring projects and building
            automation tooling. Also pursuing MCA level topics to strengthen
            theoretical foundations.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default About;
