import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const SITE_URL = "https://www.anuppradhan.in";

export async function GET() {
  const posts = getAllPosts();

  const postLines = posts.flatMap((p) => [
    `Post: ${p.title}`,
    `URL: ${SITE_URL}/blog/${p.slug}`,
    p.date ? `Published: ${p.date}` : null,
    p.excerpt ? `Summary: ${p.excerpt}` : null,
    p.tags && p.tags.length > 0 ? `Tags: ${p.tags.join(", ")}` : null,
    "",
  ]).filter((l): l is string => l !== null);

  const content = [
    "# llms.txt",
    "",
    `Site: ${SITE_URL}`,
    "Author: Anup Pradhan",
    "Title: Software Engineer Portfolio",
    "Summary: Portfolio covering software engineering projects, skills, experience, developer blog (backend, security, WebRTC/SIP), and contact details.",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /.next/",
    "",
    "# Canonical pages",
    `URL: ${SITE_URL}/`,
    `URL: ${SITE_URL}/about`,
    `URL: ${SITE_URL}/projects`,
    `URL: ${SITE_URL}/skills`,
    `URL: ${SITE_URL}/experience`,
    `URL: ${SITE_URL}/contact`,
    `URL: ${SITE_URL}/blog`,
    "",
    "# Preferred sources and attribution",
    `Attribution: Please credit "Anup Pradhan" with a link to ${SITE_URL} or https://github.com/anupPradhan0`,
    "",
    "# Project highlights",
    "Project: PipesHub - Open-source enterprise context layer for search, RAG, MCP, and agentic workplace AI.",
    "Project: Yuviz - Open-source voice AI platform (STT → LLM → TTS over SIP).",
    "Project: Dograh - Open-source self-hosted voice agent platform (Vapi/Retell alternative).",
    "Project: AutoPulse - Multi-tenant dealership and automotive management platform with RBAC and WhatsApp workflows.",
    "Project: AI-powered personal finance tracker (RukiAI) - Expense tracking with AI insights.",
    "Project: WhatsApp Campaign Management Platform - Role-based campaign and client management.",
    "Project: Neural Network From Scratch (Python) - Custom forward/backprop implementation.",
    "Project: YouTube Backend - Node/Express/Mongo backend architecture.",
    "Project: Network Marketing Full-stack - MLM-style referral and transaction workflows.",
    "",
    "# Core technical profile",
    "Skills: JavaScript, TypeScript, Python, React, Next.js, Node.js, Express, FastAPI, MongoDB, PostgreSQL, RabbitMQ, Redis, Docker, WebRTC, SIP, AI APIs.",
    "Current: Open Source SDE (Sep 2026–Present) — PipesHub, Yuviz, Dograh.",
    "Previous role: SDE-1 at Crunchy Media Pvt Ltd (Apr 2026–Aug 2026) — B2B AI Voice Calling SaaS built on FreeSWITCH, ESL, and WebRTC.",
    "",
    "# Blog posts",
    `Index: ${SITE_URL}/blog`,
    `Feed: ${SITE_URL}/blog/rss.xml`,
    "",
    ...(postLines.length > 0 ? postLines : ["(no posts yet)", ""]),
    "# Rate limits and caching suggestions",
    "Crawl-delay: 2",
    "Cache-max-age: 86400",
    "",
    "# Contact",
    "Contact: mailto:anuppradhan929@gmail.com",
    "",
    "# Discovery",
    `Robots: ${SITE_URL}/robots.txt`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
