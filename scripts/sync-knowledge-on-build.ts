import { loadEnvConfig } from "@next/env";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

loadEnvConfig(process.cwd());

if (process.env.VERCEL_ENV !== "production") {
  console.log("Knowledge sync skipped outside Vercel production. Run npm run knowledge:index for a manual refresh.");
} else {
  if (!process.env.DB_URL || !process.env.GEMINI_API_KEY) {
    console.error("Production knowledge sync requires DB_URL and GEMINI_API_KEY.");
    process.exit(1);
  }
  const require = createRequire(import.meta.url);
  const run = (script: string): boolean => {
    const result = spawnSync(process.execPath, [require.resolve("tsx/cli"), script], {
      stdio: "inherit", env: process.env,
    });
    return !result.error && result.status === 0;
  };
  if (!run("scripts/deploy-knowledge.ts")) {
    console.error("Database migration failed. Deployment stopped; fix the error and redeploy.");
    process.exit(1);
  }
  // Documents update transactionally, so a failed refresh leaves the previous index
  // serving. AI chat going stale shouldn't take the whole site's deploy down with it.
  if (!run("scripts/index-knowledge.ts")) {
    console.warn("WARNING: knowledge index NOT refreshed; AI chat keeps its previous content. Fix the error above and redeploy.");
  }
}
