import type { PrismaClient } from "@prisma/client";
import { CURRENT_WORK_DOCUMENT_ID, INDEXING_VERSION, minimumSimilarity } from "./config";
import { vectorLiteral } from "./embeddings";

export interface RetrievedChunk {
  documentId: string;
  title: string;
  content: string;
  similarity: number;
  preferred?: boolean;
}

export async function retrieveChunks(db: PrismaClient, vector: number[], currentWork = false): Promise<RetrievedChunk[]> {
  return db.$queryRaw<RetrievedChunk[]>`
    SELECT d."id" AS "documentId", d."title", c."content",
      1 - (c."embedding" <=> ${vectorLiteral(vector)}::vector) AS similarity,
      (${currentWork} AND d."id" = ${CURRENT_WORK_DOCUMENT_ID}) AS preferred
    FROM "KnowledgeChunk" c JOIN "KnowledgeDocument" d ON d."id" = c."documentId"
    WHERE d."indexingVersion" = ${INDEXING_VERSION}
    ORDER BY preferred DESC, c."embedding" <=> ${vectorLiteral(vector)}::vector LIMIT 12`;
}

export function selectContext(candidates: RetrievedChunk[], threshold = minimumSimilarity()) {
  const sections: string[] = [];
  const perDocument = new Map<string, number>();
  const seen = new Set<string>();
  let chars = 0;
  for (const chunk of candidates) {
    if ((!chunk.preferred && chunk.similarity < threshold) || seen.has(chunk.content) || (perDocument.get(chunk.documentId) ?? 0) >= 2) continue;
    if (chars + chunk.content.length > 7200) continue;
    sections.push(`${chunk.title}\n${chunk.content}`);
    chars += chunk.content.length;
    seen.add(chunk.content);
    perDocument.set(chunk.documentId, (perDocument.get(chunk.documentId) ?? 0) + 1);
    if (sections.length === 4) break;
  }
  return { context: sections.join("\n\n") };
}

export async function blogCatalog(db: PrismaClient) {
  const posts = await db.knowledgeDocument.findMany({
    where: { kind: "blog", indexingVersion: INDEXING_VERSION },
    select: { title: true }, orderBy: { title: "asc" },
  });
  return {
    response: posts.length ? `Anup has published ${posts.length} blog posts:\n${posts.map(post => `- ${post.title}`).join("\n")}` : "There are no blog posts in the knowledge base yet.",
  };
}
