import { test } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { chunkContent } from "../lib/knowledge/chunk";
import { normalizeEmbedding } from "../lib/knowledge/embeddings";
import { collectSources } from "../lib/knowledge/sources";
import { indexKnowledge, sourceHash } from "../lib/knowledge/index";
import type { SourceDocument } from "../lib/knowledge/types";

test("chunking handles empty input, long code, Unicode and preserves overlapping content", () => {
  assert.deepEqual(chunkContent("  "), []);
  const content = "## Fix\n\n" + "socket café 🔧\n".repeat(600);
  const chunks = chunkContent(content);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every(c => c.length <= 1800 && c.length > 0));
  assert.ok(chunks[0].includes("## Fix"));
  assert.ok(chunks[1].includes(chunks[0].slice(-150)));
  assert.ok(chunkContent("x".repeat(6000)).every(c => c.length <= 1800));
  assert.throws(() => chunkContent("text", 100, 100));
});

test("embedding validation rejects malformed vectors and normalizes valid ones", () => {
  assert.throws(() => normalizeEmbedding([1]));
  assert.throws(() => normalizeEmbedding(Array(768).fill(0)));
  assert.throws(() => normalizeEmbedding(Array(768).fill(NaN)));
  const normalized = normalizeEmbedding(Array(768).fill(2));
  assert.ok(Math.abs(Math.hypot(...normalized) - 1) < 1e-10);
});

test("sources include all local blogs, stable current experience and source-aware hashes", () => {
  const sources = collectSources();
  assert.ok(sources.some(s => s.id === "blog:hyprland-socket-fix" && s.content.includes("socket")));
  assert.ok(sources.some(s => s.content.includes("SDE, Full-time") || s.content.includes("SDE, ")));
  assert.ok(sources.find(s => s.id === "portfolio:experience-0")?.content.includes("Present"));
  assert.equal(new Set(sources.map(s => s.id)).size, sources.length);
  const source = sources[0];
  assert.equal(sourceHash(source), sourceHash({ ...source }));
  assert.notEqual(sourceHash(source), sourceHash({ ...source, sourceUrl: source.sourceUrl + "#changed" }));
});

const testUrl = process.env.RAG_TEST_DB_URL;
test("PostgreSQL indexing is incremental, atomic on failure, and removes deleted sources", { skip: !testUrl }, async () => {
  const url = new URL(testUrl!);
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname) && url.pathname === "/rag_test", "Use an isolated local rag_test database");
  const db = new PrismaClient({ datasources: { db: { url: testUrl } } });
  let calls = 0;
  const embed = async () => { calls++; return [1, ...Array(767).fill(0)]; };
  const source: SourceDocument = { id: "test:profile", title: "Anup's experience", kind: "portfolio", sourceUrl: "https://www.anuppradhan.in/about", content: "Backend work with TypeScript and APIs" };
  try {
    await db.knowledgeDocument.deleteMany();
    assert.equal((await indexKnowledge(db, [source], { embed, delayMs: 0 })).updated, 1);
    assert.equal((await indexKnowledge(db, [source], { embed, delayMs: 0 })).skipped, 1);
    assert.equal(calls, 1);
    await assert.rejects(indexKnowledge(db, [{ ...source, content: "Changed" }], { embed: async () => { throw new Error("API unavailable"); }, delayMs: 0 }));
    assert.equal((await db.knowledgeDocument.findUniqueOrThrow({ where: { id: source.id } })).contentHash, sourceHash(source));
    const rows = await db.$queryRaw<{ content: string }[]>`SELECT "content" FROM "KnowledgeChunk" WHERE "documentId" = ${source.id}`;
    assert.equal(rows[0].content, source.content);
    const replacement = { ...source, id: "test:new" };
    assert.equal((await indexKnowledge(db, [replacement], { embed, delayMs: 0 })).removed, 1);
    assert.equal(await db.knowledgeChunk.count(), 1);
    await assert.rejects(indexKnowledge(db, [], { embed, delayMs: 0 }));
  } finally {
    await db.knowledgeDocument.deleteMany();
    await db.$disconnect();
  }
});
