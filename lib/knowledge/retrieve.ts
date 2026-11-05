import type { PrismaClient } from "@prisma/client";
import { INDEXING_VERSION, minimumSimilarity } from "./config";
import { vectorLiteral } from "./embeddings";
import type { KnowledgeSource } from "./types";

export interface RetrievedChunk {
  documentId: string;
  title: string;
  sourceUrl: string;
  content: string;
  similarity: number;
}

export async function retrieveChunks(db: PrismaClient, vector: number[]): Promise<RetrievedChunk[]> {
  return db.$queryRaw<RetrievedChunk[]>`
    SELECT d."id" AS "documentId", d."title", d."sourceUrl", c."content",
      1 - (c."embedding" <=> ${vectorLiteral(vector)}::vector) AS similarity
    FROM "KnowledgeChunk" c JOIN "KnowledgeDocument" d ON d."id" = c."documentId"
    WHERE d."indexingVersion" = ${INDEXING_VERSION}
    ORDER BY c."embedding" <=> ${vectorLiteral(vector)}::vector LIMIT 12`;
}

export function selectContext(candidates: RetrievedChunk[], threshold = minimumSimilarity()) {
  const sources: KnowledgeSource[] = [];
  const sections: string[] = [];
  const perDocument = new Map<string, number>();
  const seen = new Set<string>();
  let chars = 0;
  for (const chunk of candidates) {
    if (chunk.similarity < threshold || seen.has(chunk.content) || (perDocument.get(chunk.documentId) ?? 0) >= 2) continue;
    if (chars + chunk.content.length > 7200) continue;
    let source = sources.find(s => s.url === chunk.sourceUrl);
    if (!source) {
      source = { id: sources.length + 1, title: chunk.title, url: chunk.sourceUrl };
      sources.push(source);
    }
    sections.push(`[${source.id}] ${chunk.title}\n${chunk.content}`);
    chars += chunk.content.length;
    seen.add(chunk.content);
    perDocument.set(chunk.documentId, (perDocument.get(chunk.documentId) ?? 0) + 1);
    if (sections.length === 4) break;
  }
  return { sources, context: sections.join("\n\n") };
}

export async function blogCatalog(db: PrismaClient) {
  const posts = await db.knowledgeDocument.findMany({
    where: { kind: "blog", indexingVersion: INDEXING_VERSION },
    select: { title: true, sourceUrl: true }, orderBy: { title: "asc" },
  });
  const sources = posts.map((post, i) => ({ id: i + 1, title: post.title, url: post.sourceUrl }));
  return {
    response: sources.length ? `Anup has published ${sources.length} blog posts:\n${sources.map(s => `[${s.id}] ${s.title}`).join("\n")}` : "There are no blog posts in the knowledge base yet.",
    sources,
  };
}
