import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { collectSources } = await import("../lib/knowledge/sources");
  const { chunkContent } = await import("../lib/knowledge/chunk");
  const sources = collectSources();
  if (process.argv.includes("--dry-run")) {
    for (const source of sources) console.log(`${source.id}: ${chunkContent(source.content).length} chunks`);
    console.log(`${sources.length} documents; no database writes or Gemini calls.`);
    return;
  }
  const { prisma } = await import("../lib/prisma");
  try {
    const { indexKnowledge } = await import("../lib/knowledge/index");
    console.log(await indexKnowledge(prisma, sources, { log: console.log }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error("Knowledge indexing failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
