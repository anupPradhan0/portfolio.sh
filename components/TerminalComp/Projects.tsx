"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { projects as projectsData, type Project } from "@/lib/portfolio-data";
import { PaneHeader } from "@/components/TerminalComp/ui";


// --- The Main Projects Component ---
const Projects: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [projectsPerPage, setProjectsPerPage] = useState<number>(2);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Handle responsive projects per page
  useEffect(() => {
    const handleResize = (): void => {
      setProjectsPerPage(window.innerWidth < 768 ? 1 : 2);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(projectsData.length / projectsPerPage);
  // Widening the window lowers totalPages, so the stored page can be out of range.
  const page = Math.min(currentPage, totalPages - 1);

  const startIndex = page * projectsPerPage;
  const currentProjects = projectsData.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  const copyCloneCommand = async (project: Project, globalIndex: number): Promise<void> => {
    const cloneCmd = `git clone ${project.githubUrl}.git`;
    try {
      await navigator.clipboard.writeText(cloneCmd);
      setCopiedIndex(globalIndex);
      window.setTimeout(() => {
        setCopiedIndex((prev) => (prev === globalIndex ? null : prev));
      }, 1200);
    } catch {
      // Fallback: best-effort selection-less copy (older browsers)
      const ta = document.createElement("textarea");
      ta.value = cloneCmd;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        setCopiedIndex(globalIndex);
        window.setTimeout(() => {
          setCopiedIndex((prev) => (prev === globalIndex ? null : prev));
        }, 1200);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <div className="pane" aria-label="Projects showcase">
      <PaneHeader
        title="~/projects"
        aside={<span className="pane-meta">{projectsData.length} projects</span>}
      />

      <div className="pane-grid">
        {currentProjects.map((project, index) => {
          const globalIndex = startIndex + index;
          // Placeholder "#" and repo-only projects have no separate live site.
          const hasLiveSite =
            project.liveUrl !== "#" && project.liveUrl !== project.githubUrl;
          return (
            <article key={project.name} className="pane-card">
              <div className="pane-media">
                <Image
                  src={project.imageUrl}
                  alt={`${project.name} project screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-contain"
                />
              </div>

              <h3 className="pane-item-title">{project.name}</h3>

              <p>{project.description}</p>

              <div className="pane-tags" aria-label="Technologies used">
                {project.tech.map((tech) => (
                  <span key={tech} className="pane-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pane-stack mt-auto">
                {project.githubUrl && (
                  <button
                    type="button"
                    onClick={() => copyCloneCommand(project, globalIndex)}
                    className="pane-code"
                    aria-label={`Copy git clone command for ${project.name}`}
                  >
                    <span className="pane-prompt">$</span>
                    <span className="min-w-0 flex-1 truncate">
                      git clone {project.githubUrl}.git
                    </span>
                    <span className="pane-prompt shrink-0">
                      {copiedIndex === globalIndex ? "copied" : "copy"}
                    </span>
                  </button>
                )}

                <nav className="flex gap-4" aria-label="Project links">
                  {hasLiveSite && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pane-link"
                      aria-label={`View ${project.name} live demo`}
                    >
                      live ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pane-link"
                      aria-label={`View ${project.name} source code on GitHub`}
                    >
                      source ↗
                    </a>
                  )}
                </nav>
              </div>
            </article>
          );
        })}
      </div>

      <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
        <button
          type="button"
          onClick={() => setCurrentPage(page - 1)}
          disabled={page === 0}
          className="pane-button"
        >
          ← prev
        </button>
        <span className="pane-meta">
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage(page + 1)}
          disabled={page === totalPages - 1}
          className="pane-button"
        >
          next →
        </button>
      </nav>
    </div>
  );
};

export default Projects;
