import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getAllPostSlugs, getPostBySlug } from "../blog";
import {
  projects, skills, experienceCompanies, CONTACT_EMAIL, CONTACT_LOCATION,
  RESUME_URL, socialLinks,
} from "../portfolio-data";
import { SITE_URL } from "../seo-config";
import type { SourceDocument } from "./types";
import { CURRENT_WORK_DOCUMENT_ID } from "./config";

// Portfolio role dates are calendar dates constructed in the local timezone.
function roleMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function collectSources(): SourceDocument[] {
  if (!existsSync(path.join(process.cwd(), "content/blog"))) throw new Error("Blog source directory is missing");
  const portfolio = (id: string, title: string, path: string, content: string): SourceDocument => ({
    id: `portfolio:${id}`, kind: "portfolio", title, sourceUrl: `${SITE_URL}${path}`, content,
  });
  const documents = [
    {
      id: CURRENT_WORK_DOCUMENT_ID, kind: "portfolio" as const, title: "Anup's current work and ongoing role",
      sourceUrl: `${SITE_URL}/experience`,
      content: experienceCompanies.flatMap(company => company.roles.filter(role => role.ongoing).map(role =>
        `Current ongoing role: ${role.title} (${role.employmentType}) at ${company.name}, since ${roleMonth(role.start)} — Present.\nCurrent work and contributions:\n${role.bullets.join("\n")}`
      )).join("\n\n") || "Anup's experience data does not list an ongoing role. His current employment is not specified.",
    },
    portfolio("profile", "About Anup Pradhan", "/about", readFileSync(path.join(process.cwd(), "content/knowledge/profile.md"), "utf8")),
    portfolio("contact", "Contact Anup", "/contact", `Email: ${CONTACT_EMAIL}. Location: ${CONTACT_LOCATION}. Resume: ${RESUME_URL}.\n${socialLinks.map(s => `${s.name}: ${s.href}`).join("\n")}`),
    portfolio("skills", "Anup's technical skills", "/skills", Object.entries(skills).map(([category, items]) => `${category}: ${items.join(", ")}`).join("\n")),
    ...projects.map((p, i) => portfolio(`project-${i}`, p.name, "/projects", `${p.name}\n${p.description}\nTechnologies: ${p.tech.join(", ")}\nWebsite: ${p.liveUrl}${p.githubUrl ? `\nGitHub: ${p.githubUrl}` : ""}`)),
    ...experienceCompanies.map((company, i) => portfolio(`experience-${i}`, `Experience at ${company.name}`, "/experience", `${company.name}, ${company.location}\n${company.roles.map(r => `${r.ongoing ? "Current ongoing role" : "Previous role (ended)"}: ${r.title}, ${r.employmentType}, ${roleMonth(r.start)} to ${r.ongoing ? "Present" : roleMonth(r.end)}\n${r.bullets.join("\n")}`).join("\n\n")}`)),
  ];
  for (const slug of getAllPostSlugs()) {
    const post = getPostBySlug(slug);
    if (!post) throw new Error(`Could not read blog source: ${slug}`);
    documents.push({
      id: `blog:${slug}`, kind: "blog", title: post.title,
      sourceUrl: `${SITE_URL}/blog/${slug}`,
      content: `${post.title}\nPublished: ${post.date}\nTags: ${(post.tags ?? []).join(", ")}\n${post.excerpt ?? ""}\n\n${post.content}`,
    });
  }
  return documents;
}
