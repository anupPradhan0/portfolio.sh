import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const genAI = new GoogleGenerativeAI(apiKey || "");

const CONTEXT_PARTS = {
  base: `You are Anup Pradhan's AI assistant on his portfolio terminal. CRITICAL: Reply in 2–3 short sentences only. Never write long paragraphs or list everything—give a direct, brief answer to what was asked. Anup is a Software Developer (backend focus): RESTful APIs, MERN/TypeScript, JWT, Cloudinary, Vercel/Render; exploring AI/ML. Based in Bhubaneswar, India.`,

  skills: `Tech: Languages — JavaScript, TypeScript, Python, C++, HTML5, CSS3. Frontend — React, Next.js, Remix, TanStack Query, Tailwind CSS, EJS, Vite. Backend — Node.js, Express.js, FastAPI, REST APIs, Auth0. Databases — MongoDB, Mongoose, MongoDB Atlas, RabbitMQ, Redis. Tools — Git & GitHub, Docker, Postman, Linux/CLI, Claude Code, OpenCode, Auth0, Dokploy, Ubuntu Deployment, S3 Storage, Cloudinary Storage. AI/ML — Pandas, NumPy, PyTorch, TensorFlow (basics), Cohere API, Gemini API, OpenAI API.`,

  projects: `Projects (type 'cd projects' to see all): 1) AutoPulse — multi-tenant dealership/showroom management (RBAC, WhatsApp, enquiries, lead/CRM), deployed to 5+ showrooms, 5000+ visitor entries; GitHub: anupPradhan0/AutoPulseOLD. 2) WhatsApp Campaign Management — MERN + TypeScript, admin/reseller roles, Cloudinary; live: whats-app-campaigner.vercel.app, GitHub: anupPradhan0/WhatsApp-Campaigner. 3) RukiAI — AI personal finance tracker with Cohere API; rukiai.online, GitHub: AI-Personal-Finance-Tracker. 4) Neural Network from scratch (Python/NumPy); digit-recognizer-fullstack.vercel.app. 5) Network Marketing full‑stack (MLM); GitHub: Network-Marketing. 6) YouTube Backend (Node, Express, MongoDB, JWT); GitHub: YouTube-Clone-Backend. 7) AI Madness — compare ChatGPT, Claude, Gemini, etc. on one dashboard; ai-madness.onrender.com, GitHub: AI-Madness.`,

  experience: `Current roles: (1) CHATI — Software Developer (Internship), Oct 2025–Present, Bhubaneswar. Work: AI meeting assistant (joins calls, transcripts, summaries), Zoom/Teams/Google Meet, custom CMS, data pipeline migrating 1.2M+ records. (2) Prominds Digital — Software Developer (Part-time), Jul 2024–Present, Bhubaneswar. Work: SaaS showroom visitor management for dealerships, 5+ deployments, 5k+ entries/month, WhatsApp integration, lead pipelines, CRM migration.`,

  contact: `Contact: Email anuppradhan929@gmail.com. LinkedIn linkedin.com/in/anup-pradhan77. GitHub github.com/anupPradhan0. Twitter/X x.com/AnupPradhan0. Instagram instagram.com/anup.pradhan_. YouTube youtube.com/@morscode7. LeetCode leetcode.com/u/Anuppradhan. Resume: docs.google.com/document/d/17j42jMRIdxD2HG9eWuUKHr0StgfkClw0 (also linked on contact page). Location: Bhubaneswar, Odisha, India.`,

  education: `Education: BCA at Amity University (2024–2027, CGPA 8.93). Higher secondary (11th & 12th, I.T.) at Autonomous College Khariar (2022–2024). Schooling from village school (2009–2022).`,
};

function getRelevantContext(question: string): string {
  const q = question.toLowerCase();
  let context = CONTEXT_PARTS.base;

  if (
    q.includes("skill") ||
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("know") ||
    q.includes("language") ||
    q.includes("tool")
  ) {
    context += "\n" + CONTEXT_PARTS.skills;
  }

  if (
    q.includes("project") ||
    q.includes("built") ||
    q.includes("portfolio") ||
    q.includes("github") ||
    q.includes("app")
  ) {
    context += "\n" + CONTEXT_PARTS.projects;
  }

  if (
    q.includes("experience") ||
    q.includes("job") ||
    q.includes("work") ||
    q.includes("company") ||
    q.includes("chati") ||
    q.includes("prominds") ||
    q.includes("internship") ||
    q.includes("role")
  ) {
    context += "\n" + CONTEXT_PARTS.experience;
  }

  if (
    q.includes("contact") ||
    q.includes("reach") ||
    q.includes("email") ||
    q.includes("linkedin") ||
    q.includes("resume") ||
    q.includes("hire") ||
    q.includes("connect")
  ) {
    context += "\n" + CONTEXT_PARTS.contact;
  }

  if (
    q.includes("study") ||
    q.includes("education") ||
    q.includes("university") ||
    q.includes("college") ||
    q.includes("bca") ||
    q.includes("cgpa")
  ) {
    context += "\n" + CONTEXT_PARTS.education;
  }

  if (
    q.includes("who") ||
    q.includes("about anup") ||
    q.includes("tell me about") ||
    q.includes("introduce")
  ) {
    context +=
      "\n" +
      CONTEXT_PARTS.skills +
      "\n" +
      CONTEXT_PARTS.experience +
      "\n" +
      CONTEXT_PARTS.projects;
  }

  return context;
}

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured", success: false },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "No message provided", success: false },
        { status: 400 }
      );
    }

    const relevantContext = getRelevantContext(message);

    console.log("📊 Context tokens (approx):", relevantContext.length / 4);

    const model = genAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.6,
      },
      systemInstruction: relevantContext,
    });

    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({
      response: text,
      success: true,
    });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : typeof error === "string" ? error : String(error);

    console.error("Gemini Error:", error);

    // Rate limit / quota exceeded (429) – show friendly message, don't expose raw API error
    const isRateLimit =
      errMsg.includes("429") ||
      errMsg.includes("Too Many Requests") ||
      errMsg.includes("quota") ||
      errMsg.includes("rate limit");

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
      {
        error: "AI temporarily unavailable",
        details: errMsg,
        success: false,
      },
      { status: 500 }
    );
  }
}
