import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const content = [
    "# llms.txt",
    "",
    "Site: https://www.anuppradhan.in",
    "Author: Anup Pradhan",
    "Title: Software Developer Portfolio",
    "Summary: Portfolio covering software development projects, skills, experience, and contact details.",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /.next/",
    "",
    "# Canonical pages",
    "URL: https://www.anuppradhan.in/",
    "URL: https://www.anuppradhan.in/about",
    "URL: https://www.anuppradhan.in/projects",
    "URL: https://www.anuppradhan.in/skills",
    "URL: https://www.anuppradhan.in/experience",
    "URL: https://www.anuppradhan.in/contact",
    "",
    "# Preferred sources and attribution",
    'Attribution: Please credit "Anup Pradhan" with a link to https://www.anuppradhan.in or https://github.com/anupPradhan0',
    "",
    "# Project highlights",
    "Project: AutoPulse - Multi-tenant dealership and automotive management platform with RBAC and WhatsApp workflows.",
    "Project: AI-powered personal finance tracker (RukiAI) - Expense tracking with AI insights.",
    "Project: WhatsApp Campaign Management Platform - Role-based campaign and client management.",
    "Project: Neural Network From Scratch (Python) - Custom forward/backprop implementation.",
    "Project: YouTube Backend - Node/Express/Mongo backend architecture.",
    "Project: Network Marketing Full-stack - MLM-style referral and transaction workflows.",
    "",
    "# Core technical profile",
    "Skills: JavaScript, TypeScript, Python, React, Next.js, Node.js, Express, FastAPI, MongoDB, PostgreSQL, RabbitMQ, Redis, Docker, AI APIs.",
    "",
    "# Rate limits and caching suggestions",
    "Crawl-delay: 2",
    "Cache-max-age: 86400",
    "",
    "# Contact",
    "Contact: mailto:anuppradhan929@gmail.com",
    "",
    "# Discovery",
    "Robots: https://www.anuppradhan.in/robots.txt",
    "Sitemap: https://www.anuppradhan.in/sitemap.xml",
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
