import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const genAI = new GoogleGenerativeAI(apiKey || "");

const MAX_QUESTION_CHARS = 400;
const MAX_OUTPUT_TOKENS = 100;

const SYSTEM = `You answer questions about Anup Pradhan on his portfolio terminal.
Rules: 1–3 short sentences. Answer only what was asked. No fluff, no bullet dumps, no repeating the question.
If unknown from facts below, say so briefly and suggest: cd about | projects | skills | experience | contact.`;

/** Compact facts — keep short; only inject what the question needs. */
const FACTS = {
  bio: `Anup Pradhan — Software Engineer, Bhubaneswar, India. Backend focus (APIs, MERN/TS, JWT). Exploring AI/ML. Currently Open Source SDE (Sep 2026–Present): PipesHub, Yuviz, Dograh.`,

  skills: `Skills: JS/TS, Python, C++, React, Next.js, Remix, Node, Express, FastAPI, MongoDB, Postgres, Redis, RabbitMQ, Docker, K8s, AWS/Azure/GCP, Vercel, RAG, MCP, PyTorch/TF.`,

  projects: `Projects: PipesHub (OSS enterprise RAG/MCP) pipeshub-ai/pipeshub-ai; Yuviz (OSS voice AI/SIP) yuviz-ai/yuviz; Dograh (OSS voice agents) dograh-hq/dograh; AutoPulse (dealership CRM, 5+ showrooms) anupPradhan0/AutoPulseOLD; WhatsApp Campaigner whats-app-campaigner.vercel.app; RukiAI finance tracker ruki.anuppradhan.in; NN from scratch digit-recognizer-fullstack.vercel.app; MLM platform Network-Marketing; YT backend YouTube-Clone-Backend; AI Madness ai-madness.onrender.com.`,

  experience: `Exp: Open Source SDE Sep 2026–Present (PipesHub, Yuviz, Dograh). Crunchy Media SDE-1 Apr–Aug 2026 (AI voice SaaS, FreeSWITCH/WebRTC/STT-LLM-TTS); Intern Oct 2025–Mar 2026 (meeting AI 500+ users, 1.2M record pipeline). Prominds: Full Stack Nov 2025–Apr 2026 (AutoPulse); WordPress Apr–Nov 2025.`,

  contact: `Contact: anuppradhan929@gmail.com | linkedin.com/in/anuppradhan0 | github.com/anupPradhan0 | x.com/AnupPradhan0 | youtube.com/@mors.dev7 | leetcode.com/u/Anuppradhan | resume: drive.google.com/file/d/14VsKNKYOgkwxUzV8RUUslFsyw8_lGltr/view`,

  education: `Edu: BCA Amity Univ 2024–2027 (CGPA 8.93). HS I.T. Autonomous College Khariar 2022–2024.`,
} as const;

type Topic = keyof typeof FACTS;

const TOPIC_RULES: { topic: Topic; re: RegExp }[] = [
  {
    topic: "skills",
    re: /\b(skill|tech|stack|languages?|frameworks?|tools?|familiar)\b/,
  },
  {
    topic: "projects",
    re: /\b(projects?|built|portfolio|github|apps?|repos?|pipeshub|yuviz|dograh|autopulse|ruki|whatsapp)\b/,
  },
  {
    topic: "experience",
    re: /\b(experience|job|work(?:ed|ing)?|company|role|intern|crunchy|prominds|hired?|career|sde)\b/,
  },
  {
    topic: "contact",
    re: /\b(contact|email|reach|linkedin|resume|hire|connect|twitter|youtube|phone)\b/,
  },
  {
    topic: "education",
    re: /\b(stud(?:y|ies|ied)|education|university|college|bca|cgpa|school|degree)\b/,
  },
  {
    topic: "bio",
    re: /\b(who|about|introduc|yourself|anup|background)\b/,
  },
];

function pickTopics(question: string): Set<Topic> {
  const q = question.toLowerCase();
  const topics = new Set<Topic>();

  for (const { topic, re } of TOPIC_RULES) {
    if (re.test(q)) topics.add(topic);
  }

  // "about me / who is" → compact bio only (not every section)
  if (topics.has("bio") && topics.size === 1) {
    return new Set<Topic>(["bio"]);
  }

  // Nothing matched → bio is enough for a useful default answer
  if (topics.size === 0) topics.add("bio");

  return topics;
}

function buildSystemInstruction(question: string): string {
  const topics = pickTopics(question);
  const facts = [...topics].map((t) => FACTS[t]).join("\n");
  return `${SYSTEM}\n\nFacts:\n${facts}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured", success: false },
        { status: 500 }
      );
    }

    const body = await request.json();
    const raw = typeof body?.message === "string" ? body.message.trim() : "";

    if (!raw) {
      return NextResponse.json(
        { error: "No message provided", success: false },
        { status: 400 }
      );
    }

    const message = raw.slice(0, MAX_QUESTION_CHARS);
    const systemInstruction = buildSystemInstruction(message);

    const model = genAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.4,
      },
      systemInstruction,
    });

    // Direct generate — no empty chat history overhead
    const result = await model.generateContent(message);
    const text = result.response.text()?.trim() || "";

    return NextResponse.json({ response: text, success: true });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : String(error);

    console.error("Gemini Error:", error);

    const isRateLimit =
      errMsg.includes("429") ||
      errMsg.includes("Too Many Requests") ||
      errMsg.includes("quota") ||
      /rate.?limit/i.test(errMsg);

    if (isRateLimit) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Please try again in a few minutes.",
          success: false,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "AI temporarily unavailable", success: false },
      { status: 500 }
    );
  }
}
