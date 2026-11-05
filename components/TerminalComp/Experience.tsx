"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import { durationLabel } from "@/lib/duration";
import { experienceCompanies } from "@/lib/portfolio-data";

const Experience: React.FC = () => {
  const experienceData = useMemo(
    () =>
      experienceCompanies.map((company) => ({
        ...company,
        totalDuration: durationLabel(
          company.roles[company.roles.length - 1].start,
          company.roles[0].ongoing ? new Date() : company.roles[0].end
        ),
        roles: company.roles.map((role) => ({
          ...role,
          durationText: durationLabel(
            role.start,
            role.ongoing ? new Date() : role.end
          ),
          startLabel: role.start.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          }),
          endLabel: role.ongoing
            ? "Present"
            : role.end.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              }),
          metaLabel: [...new Set([role.employmentType, role.mode].filter(Boolean))].join(" · "),
        })),
      })),
    []
  );

  return (
    <div className="pane">
      <header className="pane-header">
        <h2 className="pane-title">~/experience</h2>
        <span className="pane-meta">
          {experienceData.length} organizations
        </span>
      </header>

      <div className="pane-section">
        {experienceData.map((company) => (
          <article key={company.name} className="pane-card">
            <div className="flex items-center gap-3">
              <Image
                src={company.logo}
                alt=""
                width={64}
                height={64}
                className="h-12 w-12 shrink-0 rounded-lg border border-green-800/50 bg-black/40 object-contain"
              />
              <div className="min-w-0">
                <h3 className="pane-item-title">{company.name}</h3>
                <p className="pane-meta">
                  {company.totalDuration} · {company.location}
                  {company.workMode ? ` · ${company.workMode}` : ""}
                </p>
              </div>
            </div>

            <ol className="ml-1.5 space-y-5 border-l border-green-800/50">
              {company.roles.map((role, roleIndex) => (
                <li key={`${company.name}-${role.title}`} className="relative pl-4 sm:pl-5">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                      roleIndex === 0
                        ? "bg-green-400"
                        : "border border-green-700 bg-black"
                    }`}
                  />
                  <h4 className="font-semibold text-gray-100">{role.title}</h4>
                  <p className="pane-meta">
                    {role.metaLabel ? `${role.metaLabel} · ` : ""}
                    {role.startLabel} — {role.endLabel} · {role.durationText}
                  </p>
                  <ul className="mt-2 ml-4 list-disc space-y-1">
                    {role.bullets.map((bullet) => (
                      <li key={`${role.title}-${bullet.slice(0, 12)}`}>{bullet}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Experience;
