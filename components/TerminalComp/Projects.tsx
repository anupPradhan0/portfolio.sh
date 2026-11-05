"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { projects as projectsData, type Project } from "@/lib/portfolio-data";


// --- SVG Icons ---
const GitHubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const ExternalLinkIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const CopyIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

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
      <header className="pane-header">
        <h2 className="pane-title">~/projects</h2>
        <span className="pane-meta">{projectsData.length} repos</span>
      </header>

      <div className="pane-grid">
        {currentProjects.map((project, index) => {
          const globalIndex = startIndex + index;
          const copied = copiedIndex === globalIndex;
          // Placeholder "#" and repo-only projects have no separate live site.
          const hasLiveSite =
            project.liveUrl !== "#" && project.liveUrl !== project.githubUrl;
          return (
            <article key={project.name} className="pane-card">
              <div className="relative aspect-[2/1] overflow-hidden rounded-md border border-green-800/40 bg-black/40">
                <Image
                  src={project.imageUrl}
                  alt={`${project.name} project screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-contain"
                />
              </div>

              <h3 className="pane-item-title">{project.name}</h3>

              <div className="pane-tags" aria-label="Technologies used">
                {project.tech.map((tech) => (
                  <span key={tech} className="pane-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <p>{project.description}</p>

              <div className="mt-auto flex flex-col gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => copyCloneCommand(project, globalIndex)}
                  className="pane-button flex w-full cursor-pointer items-center gap-2 text-left"
                  aria-label={`Copy git clone command for ${project.name}`}
                >
                  <span className="min-w-0 flex-1 truncate text-gray-400">
                    $ git clone {project.githubUrl}.git
                  </span>
                  {copied && <span className="shrink-0">Copied!</span>}
                  <CopyIcon />
                </button>

                <nav className="flex gap-4" aria-label="Project links">
                  {hasLiveSite && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pane-link inline-flex items-center gap-1.5"
                      aria-label={`View ${project.name} live demo`}
                    >
                      <ExternalLinkIcon />
                      live
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pane-link inline-flex items-center gap-1.5"
                    aria-label={`View ${project.name} source code on GitHub`}
                  >
                    <GitHubIcon />
                    code
                  </a>
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
          className="pane-button cursor-pointer"
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
          className="pane-button cursor-pointer"
        >
          next →
        </button>
      </nav>
    </div>
  );
};

export default Projects;
