import { createHash } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

export async function takeChatRequest(db: PrismaClient, visitor: string, now = new Date()): Promise<boolean> {
  const day = now.toISOString().slice(0, 10);
  const expiresAt = new Date(`${day}T00:00:00.000Z`);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + 1);
  const visitorHash = createHash("sha256").update(`${day}:${visitor}`).digest("hex");
  const configured = Number(process.env.RAG_DAILY_REQUEST_LIMIT || "20");
  if (!Number.isInteger(configured) || configured < 1 || configured > 1000) throw new Error("Invalid RAG_DAILY_REQUEST_LIMIT");
  return db.$transaction(async tx => {
    await tx.chatRateLimit.deleteMany({ where: { key: { startsWith: "chat:" }, expiresAt: { lt: now } } });
    for (const [key, limit] of [[`chat:visitor:${day}:${visitorHash}`, 10], [`chat:global:${day}`, configured]] as const) {
      const result = await tx.$queryRaw<{ count: number }[]>`
        INSERT INTO "ChatRateLimit" ("key", "count", "expiresAt") VALUES (${key}, 1, ${expiresAt})
        ON CONFLICT ("key") DO UPDATE SET "count" = "ChatRateLimit"."count" + 1
        WHERE "ChatRateLimit"."count" < ${limit} RETURNING "count"`;
      if (!result.length) return false;
    }
    return true;
  });
}
