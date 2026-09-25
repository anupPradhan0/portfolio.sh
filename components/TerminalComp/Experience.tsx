"use client";

import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { durationLabel } from "@/lib/duration";
import { TypewriterText, MatrixRain } from "@/components/TerminalComp/effects";
import { experienceCompanies } from "@/lib/portfolio-data";



const Experience: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 0);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <MatrixRain />

      <div
        className={`relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Terminal header */}
        <div className="mb-6 sm:mb-8 border border-green-800 bg-black/50 backdrop-blur-sm rounded-lg p-3 sm:p-4">
          <div>
            <span className="text-green-400 font-mono text-sm sm:text-base">
              <TypewriterText text="Loading experience..." delay={50} />
            </span>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {/* Experience Section */}
          <section className="border border-green-800/30 bg-gradient-to-br from-green-900/10 to-black/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-green-900/20 hover:shadow-green-900/40 transition-all duration-500">
            <div className="flex items-center mb-4 sm:mb-6">
              <span className="text-green-400 font-mono mr-2 sm:mr-4"></span>
              <h2 className="text-lg sm:text-2xl text-green-400 font-bold font-mono tracking-wider">
                EXPERIENCE.log
              </h2>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="ml-3 sm:ml-6 border-l-2 border-green-800/30 pl-3 sm:pl-6 space-y-8">
              {experienceData.map((company) => (
                <div key={company.name} className="border-b border-green-800/20 pb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        title={company.name}
                        width={64}
                        height={64}
                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg border border-green-800/50 bg-black/40 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-green-400 font-semibold text-base sm:text-lg font-mono">
                        {company.name}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {company.totalDuration}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {company.location}
                        {company.workMode ? ` · ${company.workMode}` : ""}
                      </p>
                    </div>
                  </div>

                  <ol className="relative border-l-2 border-green-800/30 ml-5 sm:ml-7 space-y-6">
                    {company.roles.map((role, roleIndex) => (
                      <li key={`${company.name}-${role.title}`} className="pl-4 sm:pl-5 relative">
                        <span
                          aria-hidden="true"
                          className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ${
                            roleIndex === 0
                              ? "bg-green-400 ring-2 ring-black shadow-[0_0_0_2px_rgba(74,222,128,0.35)]"
                              : "bg-black border-2 border-green-700"
                          }`}
                        />
                        <h4 className="text-green-400 font-semibold text-sm sm:text-base font-mono">
                          {role.title}
                        </h4>
                        <div className="mt-1">
                          {role.metaLabel ? (
                            <p className="text-gray-400 text-xs sm:text-sm">{role.metaLabel}</p>
                          ) : null}
                          <p className="text-gray-500 text-xs sm:text-sm">
                            {role.startLabel} — {role.endLabel} · {role.durationText}
                          </p>
                        </div>

                        <ul className="mt-3 list-disc list-outside space-y-1 text-gray-300 text-sm sm:text-base ml-4 sm:ml-5">
                          {role.bullets.map((bullet) => (
                            <li key={`${role.title}-${bullet.slice(0, 12)}`}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* Status footer */}
          <div className="mt-8 sm:mt-12 border-t border-green-800/30 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-green-400/70 font-mono text-xs sm:text-sm space-y-2 sm:space-y-0">
              <span>Status: Ready for new challenges</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes matrix-fall {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default Experience;
