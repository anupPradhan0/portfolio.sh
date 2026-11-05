import { createHash, randomInt } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import { chunkContent } from "./chunk";
import { INDEXING_VERSION } from "./config";
import { embedText, vectorLiteral } from "./embeddings";
import type { SourceDocument } from "./types";

export function sourceHash(source: SourceDocument): string {
  return createHash("sha256").update(JSON.stringify(source)).digest("hex");
}

export async function indexKnowledge(db: PrismaClient, sources: SourceDocument[], options: {
  embed?: typeof embedText;
  delayMs?: number;
  log?: (message: string) => void;
} = {}) {
  if (!sources.length || new Set(sources.map(s => s.id)).size !== sources.length) {
    throw new Error("Refusing to index empty or duplicate sources");
  }
  const embed = options.embed ?? embedText;
  const delayMs = options.delayMs ?? 6500;
  let updated = 0;
  let skipped = 0;
  // Separate indexer processes must not overwrite each other's source snapshots.
  const owner = randomInt(1, 2_147_483_647);
  const lease = await db.$queryRaw<{ acquired: boolean }[]>`INSERT INTO "ChatRateLimit" ("key", "count", "expiresAt")
    VALUES ('knowledge-index-lock', ${owner}, NOW() + INTERVAL '2 hours')
    ON CONFLICT ("key") DO UPDATE SET "expiresAt" = EXCLUDED."expiresAt", "count" = EXCLUDED."count"
    WHERE "ChatRateLimit"."expiresAt" < NOW() RETURNING true AS acquired`;
  if (!lease.length) throw new Error("Another knowledge indexer is running (lock expires after 2 hours)");
  try {
    for (const source of sources) {
      const hash = sourceHash(source);
      const old = await db.knowledgeDocument.findUnique({ where: { id: source.id } });
      if (old?.contentHash === hash && old.indexingVersion === INDEXING_VERSION) {
        skipped++;
        continue;
      }
      const chunks = chunkContent(source.content);
      if (!chunks.length) throw new Error(`Source has no content: ${source.id}`);
      const vectors: number[][] = [];
      for (const chunk of chunks) {
        let vector: number[] | undefined;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            vector = await embed(chunk, "RETRIEVAL_DOCUMENT", source.title);
            break;
          } catch (error) {
            const status = (error as { status?: number }).status;
            if (attempt === 2 || ![429, 500, 503].includes(status ?? 0)) throw error;
            await new Promise(resolve => setTimeout(resolve, 15_000 * (attempt + 1)));
          }
        }
        vectors.push(vector!);
        if (delayMs) await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      const renewed = await db.chatRateLimit.updateMany({
        where: { key: "knowledge-index-lock", count: owner },
        data: { expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) },
      });
      if (!renewed.count) throw new Error("Indexer lease expired; rerun indexing");
      await db.$transaction(async tx => {
        const data = { kind: source.kind, title: source.title, sourceUrl: source.sourceUrl, contentHash: hash, indexingVersion: INDEXING_VERSION };
        await tx.knowledgeDocument.upsert({ where: { id: source.id }, create: { id: source.id, ...data }, update: data });
        await tx.knowledgeChunk.deleteMany({ where: { documentId: source.id } });
        for (const [position, content] of chunks.entries()) {
          await tx.$executeRaw(Prisma.sql`INSERT INTO "KnowledgeChunk" ("documentId", "position", "content", "embedding") VALUES (${source.id}, ${position}, ${content}, ${vectorLiteral(vectors[position])}::vector)`);
        }
      }, { timeout: 30_000 });
      updated++;
      options.log?.(`Indexed ${source.id} (${chunks.length} chunks)`);
    }
    const removed = await db.knowledgeDocument.deleteMany({ where: { id: { notIn: sources.map(s => s.id) } } });
    return { updated, skipped, removed: removed.count };
  } finally {
    await db.chatRateLimit.deleteMany({ where: { key: "knowledge-index-lock", count: owner } });
  }
}
