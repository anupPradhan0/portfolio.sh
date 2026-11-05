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
  for (const script of ["scripts/deploy-knowledge.ts", "scripts/index-knowledge.ts"]) {
    const result = spawnSync(process.execPath, [require.resolve("tsx/cli"), script], {
      stdio: "inherit", env: process.env,
    });
    if (result.error || result.status !== 0) {
      console.error("Production knowledge sync failed. Deployment stopped; fix the error and redeploy.");
      process.exit(result.status || 1);
    }
  }
}
