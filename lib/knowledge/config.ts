export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;
export const CHAT_MODEL = "gemini-2.5-flash-lite";
export const INDEXING_VERSION = `${EMBEDDING_MODEL}:${EMBEDDING_DIMENSIONS}:paragraph-v1`;
export const MAX_QUESTION_CHARS = 1000;
export const MAX_HISTORY_TURNS = 4;

export function minimumSimilarity(): number {
  const value = Number(process.env.RAG_MIN_SIMILARITY ?? "0.45");
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error("RAG_MIN_SIMILARITY must be between 0 and 1");
  }
  return value;
}
