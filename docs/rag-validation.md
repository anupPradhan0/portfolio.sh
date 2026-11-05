# QA & Test Report

**COMMAND / ENVIRONMENT:** `RAG_TEST_DB_URL=postgresql://postgres:rag_test@127.0.0.1:55439/rag_test npm run test:rag`; isolated PostgreSQL 16 with pgvector in Docker. `npx tsc --noEmit`, `npm run lint`, `npm run build`; production Next.js server with headless Chromium for API/browser checks.

**RESULT:** 8/8 automated tests passed. TypeScript and production build passed. Lint passed with two existing warnings. Live Google embedding/indexing verification is blocked by an invalid local API key.

## Defects / Failures

1. **[high] Google rejects the configured local key** — environment configuration, not a tracked source file.
   - **Steps / Condition:** Call the embedding API using the local `GEMINI_API_KEY`.
   - **Expected vs Actual:** A normalized 768-dimensional embedding vs HTTP 400 `API_KEY_INVALID`.
   - **Impact:** The hosted database migration succeeded, but the live knowledge index remains empty. A valid Google AI Studio Free-tier key must be supplied before running `npm run knowledge:index`. Real retrieval quality and relevance-threshold calibration are unverified.
2. **[low] Existing lint warnings** — `app/sitemap.ts:7` and `components/TerminalComp/Blog.tsx:275`.
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
