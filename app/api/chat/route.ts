import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INDEXING_VERSION } from "@/lib/knowledge/config";
import { embedText } from "@/lib/knowledge/embeddings";
import { parseChatInput, isBlogCatalogQuestion, isCurrentWorkQuestion, retrievalQuestion } from "@/lib/knowledge/input";
import { retrieveChunks, selectContext, blogCatalog } from "@/lib/knowledge/retrieve";
import { takeChatRequest } from "@/lib/knowledge/rate-limit";
import { generateAnswer } from "@/lib/knowledge/answer";

export const runtime = "nodejs";
export const maxDuration = 60;

const json = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: NextRequest) {
  let input;
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return json({ success: false, error: "Request is too large" }, 413);
    input = parseChatInput(JSON.parse(raw));
  } catch {
    return json({ success: false, error: "Provide a question of up to 1000 characters and at most four recent exchanges" }, 400);
  }
  try {
    if (!process.env.GEMINI_API_KEY) return json({ success: false, error: "AI is not configured" }, 503);
    const ready = await prisma.knowledgeDocument.count({ where: { indexingVersion: INDEXING_VERSION } });
    if (!ready) return json({ success: false, error: "The knowledge base is being prepared. Please try again later." }, 503);
    const visitor = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for") ?? "unknown"
      : request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (!await takeChatRequest(prisma, visitor)) {
      return json({ success: false, error: "Today's AI request limit has been reached. Please try again tomorrow." }, 429);
    }
    const { message, history } = input;
    if (isBlogCatalogQuestion(message)) return json({ success: true, ...await blogCatalog(prisma) });
    const vector = await embedText(retrievalQuestion(message, history), "RETRIEVAL_QUERY");
    const { context } = selectContext(await retrieveChunks(prisma, vector, isCurrentWorkQuestion(message)));
    if (!context) {
      return json({ success: true, response: "I couldn't find information about that in Anup's portfolio or blog posts. Try asking about his projects, experience, skills, or a blog topic." });
    }
    return json({ success: true, response: await generateAnswer(message, history, context) });
  } catch (error) {
    const status = (error as { status?: number }).status;
    // Avoid logging database connection strings or request contents.
    console.error("RAG request failed", { status, code: (error as { code?: string }).code, name: error instanceof Error ? error.name : "Unknown" });
    if (status === 429) return json({ success: false, error: "Gemini's free-tier quota is currently exhausted. Please try again later." }, 429);
    return json({ success: false, error: "AI temporarily unavailable. Please try again later." }, 503);
  }
}
