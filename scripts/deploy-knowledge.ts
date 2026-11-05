import { loadEnvConfig } from "@next/env";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

loadEnvConfig(process.cwd());
const require = createRequire(import.meta.url);
const result = spawnSync(process.execPath, [require.resolve("prisma/build/index.js"), "migrate", "deploy"], {
  stdio: "inherit", env: process.env,
});
if (result.error) console.error("Could not run Prisma migrations:", result.error.message);
process.exitCode = result.status ?? 1;
