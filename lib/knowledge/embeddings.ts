import { GoogleGenAI } from "@google/genai";
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from "./config";

export function geminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey, httpOptions: { timeout: 20_000 } });
}

export function normalizeEmbedding(values: number[]): number[] {
  if (values.length !== EMBEDDING_DIMENSIONS || values.some(v => !Number.isFinite(v))) {
    throw new Error("Invalid embedding dimensions or values");
  }
  const norm = Math.hypot(...values);
  if (norm === 0) throw new Error("Empty embedding vector");
  return values.map(v => v / norm);
}

export async function embedText(text: string, taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY", title?: string): Promise<number[]> {
  const response = await geminiClient().models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: { outputDimensionality: EMBEDDING_DIMENSIONS, taskType, ...(title ? { title } : {}) },
  });
  return normalizeEmbedding(response.embeddings?.[0]?.values ?? []);
}

export function vectorLiteral(values: number[]): string {
  return JSON.stringify(normalizeEmbedding(values));
}
