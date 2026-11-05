import { MAX_HISTORY_TURNS, MAX_QUESTION_CHARS } from "./config";
import type { ChatTurn } from "./types";

export function parseChatInput(body: unknown): { message: string; history: ChatTurn[] } {
  if (!body || typeof body !== "object") throw new Error("Provide a question");
  const { message, history = [] } = body as { message?: unknown; history?: unknown };
  if (typeof message !== "string" || !message.trim()) throw new Error("Provide a question");
  if (message.length > MAX_QUESTION_CHARS) throw new Error(`Questions must be ${MAX_QUESTION_CHARS} characters or fewer`);
  if (!Array.isArray(history) || history.length > MAX_HISTORY_TURNS) throw new Error("Invalid conversation history");
  const turns = history.map(turn => {
    if (!turn || typeof turn.question !== "string" || typeof turn.answer !== "string" ||
      !turn.question.trim() || !turn.answer.trim() || turn.question.length > MAX_QUESTION_CHARS || turn.answer.length > 1600) {
      throw new Error("Invalid conversation history");
    }
    return { question: turn.question.trim(), answer: turn.answer.trim() };
  });
  return { message: message.trim(), history: turns };
}

export function isBlogCatalogQuestion(question: string): boolean {
  return /^(?:please\s+)?(?:(?:list|show)(?:\s+me)?(?:\s+all)?(?:\s+(?:your|his|anup'?s|the|my))?\s+(?:blogs?|blog posts?|articles?)|what\s+(?:blogs?|blog posts?|articles?)(?:\s+(?:has anup|have you|has he))?\s+(?:written|published)|(?:what|which)\s+(?:are\s+)?(?:all\s+)?(?:your|his|anup'?s|the|my)\s+(?:blogs?|blog posts?|articles?))[?.!\s]*$/i.test(question.trim());
}

export function retrievalQuestion(message: string, history: ChatTurn[]): string {
  const previous = history.at(-1)?.question;
  // Use user questions for follow-ups; model answers must not become evidence.
  const followUp = /\b(it|its|that|those|there|they|them|these|he|his)\b/i.test(message);
  return previous && followUp ? `Previous question: ${previous}\nCurrent question: ${message}` : message;
}
