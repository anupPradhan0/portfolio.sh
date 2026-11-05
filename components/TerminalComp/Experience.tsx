"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import { durationLabel } from "@/lib/duration";
import { PaneHeader } from "@/components/TerminalComp/ui";
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
      <PaneHeader title="~/experience" lede="Where I've worked and what I shipped there." />

      <div className="pane-divided">
        {experienceData.map((company) => (
          <article key={company.name} className="pane-section">
            <div className="flex items-center gap-3">
              <Image
                src={company.logo}
                alt=""
                width={64}
                height={64}
                className="h-9 w-9 shrink-0 rounded-sm object-contain"
              />
              <div className="min-w-0">
                <h3 className="pane-item-title">{company.name}</h3>
                <p className="pane-meta">
                  {company.totalDuration} · {company.location}
                  {company.workMode ? ` · ${company.workMode}` : ""}
                </p>
              </div>
            </div>

            <ol className="pane-timeline">
              {company.roles.map((role) => (
                <li
                  key={`${company.name}-${role.title}`}
                  className={role.ongoing ? "is-current" : undefined}
                >
                  <h4 className="pane-strong">{role.title}</h4>
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
