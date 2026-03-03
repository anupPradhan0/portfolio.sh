import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const CONTEXT_PARTS = {
  base: `You are Anup's AI assistant. Answer concisely (2-3 sentences). Anup Pradhan is a Software Developer with Next.js, BCA student at Amity University (CGPA: 8.96).`,

  skills: `Tech Stack: JavaScript/TypeScript, Python, React, Next.js, Node.js, Express, MongoDB, Tailwind, Docker, Git, TensorFlow, Cohere AI.`,

  projects: `Key Projects:
1. WhatsApp Campaign (MERN+TS, admin system) - github.com/anupPradhan0/WhatsApp-Campaigner
2. RukiAI (AI finance tracker) - rukiai.online
3. Neural Network from scratch (Python/NumPy)
Type 'projects' to see all.`,

  contact: `Contact: anuppradhan929@gmail.com | GitHub: anupPradhan0 | LinkedIn: anup-pradhan77 | Bhubaneswar, India. Type 'contact' for full info.`,

  education: `Education: BCA at Amity University (2024-27, CGPA 8.96), I.T. at Autonomous College Khariar (2022-24).`,
};

function getRelevantContext(question: string): string {
  const q = question.toLowerCase();
  let context = CONTEXT_PARTS.base;

  if (
    q.includes("skill") ||
    q.includes("tech") ||
    q.includes("know") ||
    q.includes("language")
  ) {
    context += "\n" + CONTEXT_PARTS.skills;
  }

  if (
    q.includes("project") ||
    q.includes("built") ||
    q.includes("work") ||
    q.includes("portfolio")
  ) {
    context += "\n" + CONTEXT_PARTS.projects;
  }

  if (
    q.includes("contact") ||
    q.includes("reach") ||
    q.includes("email") ||
    q.includes("linkedin")
  ) {
    context += "\n" + CONTEXT_PARTS.contact;
  }

  if (
    q.includes("study") ||
    q.includes("education") ||
    q.includes("university") ||
    q.includes("college")
  ) {
    context += "\n" + CONTEXT_PARTS.education;
  }

  if (
    q.includes("who") ||
    q.includes("about anup") ||
    q.includes("tell me about")
  ) {
    context += "\n" + CONTEXT_PARTS.skills + "\n" + CONTEXT_PARTS.projects;
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
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
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
