import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { prisma } = await import("../lib/prisma");
  try {
    const { collectSources } = await import("../lib/knowledge/sources");
    const { sourceHash } = await import("../lib/knowledge/index");
    const { INDEXING_VERSION } = await import("../lib/knowledge/config");
    const sources = collectSources();
    const documents = await prisma.knowledgeDocument.findMany();
    const stale = sources.filter(s => !documents.some(d => d.id === s.id && d.contentHash === sourceHash(s) && d.indexingVersion === INDEXING_VERSION));
    const removed = documents.filter(d => !sources.some(s => s.id === d.id));
    console.log({ documents: documents.length, chunks: await prisma.knowledgeChunk.count(), pending: stale.map(s => s.id), deletedSources: removed.map(d => d.id) });
    if (stale.length || removed.length) process.exitCode = 1;
  } finally { await prisma.$disconnect(); }
}

main().catch(() => {
  console.error("Knowledge check failed. Check DB_URL and run npm run db:deploy first.");
  process.exitCode = 1;
});
