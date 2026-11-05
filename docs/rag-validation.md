# QA & Test Report

**COMMAND / ENVIRONMENT:** `RAG_TEST_DB_URL=postgresql://postgres:rag_test@127.0.0.1:55439/rag_test npm run test:rag`; isolated PostgreSQL 16 with pgvector in Docker. `npx tsc --noEmit`, `npm run lint`, `npm run build`; production Next.js server with headless Chromium for API/browser checks.

**RESULT:** Initial database verification: 8/8 automated tests passed. After the live model/configuration update: five pure tests passed, with three isolated-database tests skipped. TypeScript and the updated production build passed. Lint previously passed with two existing warnings. Live embedding, indexing, retrieval, generation, and production sync checks now pass with the replacement key.

## Defects / Failures

1. **[low] Existing lint warnings** — `app/sitemap.ts:7` and `components/TerminalComp/Blog.tsx:275`.
   - **Steps / Condition:** Run `npm run lint`.
   - **Expected vs Actual:** No diagnostics vs unused variable and existing hook-dependency warnings; zero errors. These files were not changed.

## Verified Working

- Empty, long, Unicode, paragraph, and overlap chunking. Assertions catch dropped boundaries and oversized chunks.
- Embedding dimensions, finite values, and unit normalization. Invalid vectors fail validation.
- Local source collection includes the blogs and stable ongoing experience. Metadata changes invalidate hashes.
- Real PostgreSQL indexing skips unchanged sources, preserves existing content after a failed embedding call, removes deleted sources, and cascades chunk deletion. Assertions fail if an interrupted update changes the stored document/hash.
- Real pgvector cosine ordering selects the closest synthetic vector, excludes old embedding versions, and returns all six fixture blogs rather than truncating at the retrieval limit.
- Context selection rejects weak and duplicate chunks, caps repeated documents and context size, and preserves source numbering.
- Input validation rejects malformed history and oversized questions; follow-up retrieval includes prior user questions but not prior assistant answers.
- Concurrent database requests enforce per-visitor and global caps and allow requests on the next UTC day. Assertions fail if concurrent calls exceed either cap.
- Both migrations applied successfully to the isolated test database; the knowledge migration also applied to the existing hosted database.
- Dry run found 20 documents and 34 chunks without database writes or Google calls.
- Production API returned 400 for invalid/empty/oversized questions and malformed history, 413 for an oversized request body, all four actual blog titles/links for the catalog fixture, `Cache-Control: no-store`, and a sanitized 503 for invalid upstream credentials.
- Headless Chromium verified source links, rejection of a `javascript:` source URL, follow-up history payloads, clear resetting conversation memory, quota error display, input recovery, mobile layout, and zero browser runtime errors. Successful Gemini responses were simulated for these UI checks; API validation/catalog/error checks exercised the real local backend. Synthetic vectors and fixtures were confined to the isolated test database.
- Production build generated all pages and the dynamic chat API successfully.

## Live verification — November 6, 2026

- The replacement Google AI Studio key successfully generated normalized 768-dimensional document and question embeddings.
- The hosted database contains 20 documents and 34 chunks. `npm run knowledge:check` reports no pending changes or deleted sources.
- Switched the answer model to `gemini-3.5-flash-lite` with minimal thinking after Google rejected the older model for this API project. Google's current pricing page lists a standard API free tier for the replacement model.
- Supported sample queries retrieved the expected profile/skills/Hyprland material: top cosine similarities about 0.737, 0.786, and 0.810. Voice AI experience also produced a relevant result, about 0.719.
- Raised the default relevance cutoff from 0.45 to 0.60 after unrelated France/cake questions scored about 0.479/0.476. This is sample calibration, not a general accuracy guarantee.
- Real production-built `/api/chat` requests returned HTTP 200 for a sourced Hyprland explanation, an unsupported-question fallback with zero sources for the France question, and the complete four-post blog catalog.
- `VERCEL_ENV=production npm run knowledge:sync` successfully checked migrations and skipped all 20 unchanged documents without new embedding calls.
- Preview/local synchronization checks exited successfully without invoking migrations/indexing; a production invocation with empty required configuration failed before database access.
- `npm run build` passed and its post-build sync hook correctly skipped synchronization outside production.

## Answer-only UI update — November 6, 2026

- All eight automated tests passed against isolated PostgreSQL + pgvector after the catalog/context changes. TypeScript and targeted lint checks passed.
- Live `/api/chat` requests for the blog catalog and Hyprland explanation returned only `success` and `response`, with no source metadata or numeric citations.
- Retrieval still supplies relevant knowledge text to Gemini but no longer fetches source URLs for chat or adds source-number labels to its context.
