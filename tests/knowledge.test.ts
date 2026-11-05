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
if (testUrl) {
  const url = new URL(testUrl);
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname) && url.pathname === "/rag_test", "Use an isolated local rag_test database");
}
test("PostgreSQL indexing is incremental, atomic on failure, and removes deleted sources", { skip: !testUrl }, async () => {
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

test("chat input bounds history and separates follow-ups from blog catalog requests", async () => {
  const { parseChatInput, isBlogCatalogQuestion, retrievalQuestion } = await import("../lib/knowledge/input");
  for (const body of [null, {}, { message: " " }, { message: "x".repeat(1001) }, { message: "hi", history: [null] }, { message: "hi", history: Array(5).fill({ question: "q", answer: "a" }) }]) {
    assert.throws(() => parseChatInput(body));
  }
  assert.equal(parseChatInput({ message: "  café 🔧  " }).message, "café 🔧");
  assert.equal(parseChatInput({ message: "x".repeat(1000) }).message.length, 1000);
  assert.ok(isBlogCatalogQuestion("List all your blog posts"));
  assert.ok(isBlogCatalogQuestion("What blogs have you written?"));
  assert.ok(!isBlogCatalogQuestion("Show blog posts about Linux"));
  const turns = [{ question: "Tell me about AutoPulse", answer: "Untrusted old answer" }];
  assert.ok(retrievalQuestion("What technologies does it use?", turns).includes("AutoPulse"));
  assert.ok(!retrievalQuestion("What technologies does it use?", turns).includes("Untrusted"));
  assert.equal(retrievalQuestion("What is his education?", []), "What is his education?");
});

test("context selection rejects weak and duplicate matches, diversifies sources and bounds size", async () => {
  const { selectContext } = await import("../lib/knowledge/retrieve");
  const match = { documentId: "a", title: "A", sourceUrl: "https://example.com/a", content: "A fact", similarity: 0.9 };
  const selected = selectContext([match, match, { ...match, content: "Another fact" }, { ...match, content: "Third fact" }, { ...match, documentId: "b", sourceUrl: "https://example.com/b", content: "B fact" }, { ...match, content: "Weak fact", similarity: 0.1 }], 0.45);
  assert.ok(selected.context.includes("A fact"));
  assert.ok(selected.context.includes("B fact"));
  assert.ok(!/\[\d+\]/.test(selected.context));
  assert.ok(!selected.context.includes("Third fact"));
  assert.ok(!selected.context.includes("Weak fact"));
  assert.equal(selectContext([{ ...match, content: "x".repeat(8000) }]).context, "");
  assert.equal(selectContext([{ ...match, similarity: 0.1 }]).context, "");
});

test("pgvector orders actual vectors, excludes old models, and lists every blog", { skip: !testUrl }, async () => {
  const { retrieveChunks, blogCatalog } = await import("../lib/knowledge/retrieve");
  const db = new PrismaClient({ datasources: { db: { url: testUrl } } });
  const docs: SourceDocument[] = Array.from({ length: 6 }, (_, i) => ({ id: `blog:test-${i}`, kind: "blog", title: `Blog ${i}`, sourceUrl: `https://example.com/${i}`, content: `Example text ${i}` }));
  const first = [1, ...Array(767).fill(0)];
  const second = [0, 1, ...Array(766).fill(0)];
  try {
    await indexKnowledge(db, docs, { embed: async text => text.endsWith("0") ? first : second, delayMs: 0 });
    const matches = await retrieveChunks(db, first);
    assert.equal(matches[0].documentId, "blog:test-0");
    assert.ok(matches[0].similarity > 0.99);
    const catalog = await blogCatalog(db);
    assert.equal(catalog.response.split("\n").length, 7);
    assert.ok(!("sources" in catalog));
    assert.ok(!/\[\d+\]/.test(catalog.response));
    await db.knowledgeDocument.update({ where: { id: "blog:test-0" }, data: { indexingVersion: "old-model" } });
    assert.ok((await retrieveChunks(db, first)).every(row => row.documentId !== "blog:test-0"));
  } finally { await db.knowledgeDocument.deleteMany(); await db.$disconnect(); }
});

test("database rate limits hold under concurrent visitors and reset the following day", { skip: !testUrl }, async () => {
  const { takeChatRequest } = await import("../lib/knowledge/rate-limit");
  const db = new PrismaClient({ datasources: { db: { url: testUrl } } });
  const now = new Date("2099-01-01T12:00:00Z");
  process.env.RAG_DAILY_REQUEST_LIMIT = "20";
  try {
    await db.chatRateLimit.deleteMany({ where: { key: { startsWith: "chat:" } } });
    const requests = await Promise.all(Array.from({ length: 15 }, () => takeChatRequest(db, "visitor-a", now)));
    assert.equal(requests.filter(Boolean).length, 10);
    const others = await Promise.all(Array.from({ length: 15 }, (_, i) => takeChatRequest(db, `visitor-${i}`, now)));
    assert.equal(others.filter(Boolean).length, 10);
    assert.equal(await takeChatRequest(db, "visitor-new", now), false);
    assert.equal(await takeChatRequest(db, "visitor-a", new Date("2099-01-02T12:00:00Z")), true);
    assert.ok((await db.chatRateLimit.findMany()).every(row => !row.key.includes("visitor-a")));
  } finally {
    await db.chatRateLimit.deleteMany({ where: { key: { startsWith: "chat:" } } });
    await db.$disconnect();
    delete process.env.RAG_DAILY_REQUEST_LIMIT;
  }
});
