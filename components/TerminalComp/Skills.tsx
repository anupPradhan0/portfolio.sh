"use client";

import React from "react";
import {
  skills,
  skillCommands,
  type SkillsCategory,
} from "@/lib/portfolio-data";

const CATEGORIES: { key: keyof SkillsCategory; title: string }[] = [
  { key: "languages", title: "Languages" },
  { key: "frontend", title: "Frontend" },
  { key: "backend", title: "Backend" },
  { key: "databases", title: "Databases" },
  { key: "tools", title: "Tools" },
  { key: "deployment", title: "Deployment" },
  { key: "ai_ml", title: "AI/ML" },
];

const Skills: React.FC = () => (
  <div className="pane">
    <header className="pane-header">
      <h2 className="pane-title">~/skills</h2>
      <span className="pane-meta">{CATEGORIES.length} categories</span>
    </header>

    <div className="pane-grid">
      {CATEGORIES.map(({ key, title }) => (
        <section key={key} className="pane-card">
          <h3 className="pane-item-title">{title}</h3>
          <p className="pane-meta">$ {skillCommands[key]}</p>
          <div className="pane-tags">
            {skills[key].map((skill) => (
              <span key={skill} className="pane-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);

export default Skills;
