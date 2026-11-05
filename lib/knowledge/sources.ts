import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getAllPostSlugs, getPostBySlug } from "../blog";
import {
  projects, skills, experienceCompanies, CONTACT_EMAIL, CONTACT_LOCATION,
  RESUME_URL, socialLinks,
} from "../portfolio-data";
import { SITE_URL } from "../seo-config";
import type { SourceDocument } from "./types";

export function collectSources(): SourceDocument[] {
  if (!existsSync(path.join(process.cwd(), "content/blog"))) throw new Error("Blog source directory is missing");
  const portfolio = (id: string, title: string, path: string, content: string): SourceDocument => ({
    id: `portfolio:${id}`, kind: "portfolio", title, sourceUrl: `${SITE_URL}${path}`, content,
  });
  const documents = [
    portfolio("profile", "About Anup Pradhan", "/about", readFileSync(path.join(process.cwd(), "content/knowledge/profile.md"), "utf8")),
    portfolio("contact", "Contact Anup", "/contact", `Email: ${CONTACT_EMAIL}. Location: ${CONTACT_LOCATION}. Resume: ${RESUME_URL}.\n${socialLinks.map(s => `${s.name}: ${s.href}`).join("\n")}`),
    portfolio("skills", "Anup's technical skills", "/skills", Object.entries(skills).map(([category, items]) => `${category}: ${items.join(", ")}`).join("\n")),
    ...projects.map((p, i) => portfolio(`project-${i}`, p.name, "/projects", `${p.name}\n${p.description}\nTechnologies: ${p.tech.join(", ")}\nWebsite: ${p.liveUrl}\nGitHub: ${p.githubUrl}`)),
    ...experienceCompanies.map((company, i) => portfolio(`experience-${i}`, `Experience at ${company.name}`, "/experience", `${company.name}, ${company.location}\n${company.roles.map(r => `${r.title}, ${r.employmentType}, ${r.start.toISOString().slice(0, 7)} to ${r.ongoing ? "Present" : r.end.toISOString().slice(0, 7)}\n${r.bullets.join("\n")}`).join("\n\n")}`)),
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
