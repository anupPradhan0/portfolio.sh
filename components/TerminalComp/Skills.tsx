"use client";

import React from "react";
import { PaneHeader } from "@/components/TerminalComp/ui";
import { skills, type SkillsCategory } from "@/lib/portfolio-data";

const CATEGORIES: { key: keyof SkillsCategory; title: string }[] = [
  { key: "languages", title: "languages" },
  { key: "frontend", title: "frontend" },
  { key: "backend", title: "backend" },
  { key: "databases", title: "databases" },
  { key: "tools", title: "tools" },
  { key: "deployment", title: "deployment" },
  { key: "ai_ml", title: "ai/ml" },
];

const Skills: React.FC = () => (
  <div className="pane">
    <PaneHeader title="~/skills" lede="The languages, frameworks and infrastructure I build with." />

    <dl className="pane-rows">
      {CATEGORIES.map(({ key, title }) => (
        <div key={key}>
          <dt>{title}</dt>
          <dd className="pane-tags">
            {skills[key].map((skill) => (
              <span key={skill} className="pane-tag">
                {skill}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export default Skills;
