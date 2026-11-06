# Portfolio knowledge base and RAG

The terminal's `ai <question>` command searches public portfolio data and blog
content before generating an answer. The backend runs in a Node.js Vercel
Function; PostgreSQL remains hosted separately. There is no in-process vector
store or filesystem database.

## Components and models

| Component | Choice |
| --- | --- |
| Database | Existing PostgreSQL, with the `vector` extension |
| Document and chunk records | Prisma |
| Similarity queries and vector inserts | Parameterized Prisma SQL |
| Embedding | `gemini-embedding-001`, 768 dimensions, normalized |
| Document/query tasks | `RETRIEVAL_DOCUMENT` / `RETRIEVAL_QUERY` |
| Answer generation | `gemini-3.5-flash-lite`, minimal thinking, 350 output tokens |
| Google SDK | `@google/genai` |

Both models currently offer a standard API free tier. Your project's actual
access and quotas must be checked in Google AI Studio. These are API Free-tier
models, not a guarantee of unlimited free use on a project with billing enabled.
The code pins these choices and does not automatically fall back to paid models,
Vertex AI, Google Search, or another provider. It does not honor a legacy
`GEMINI_MODEL` override.

- [Google pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Google rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Embedding tasks and normalization](https://ai.google.dev/gemini-api/docs/embeddings)
- [pgvector](https://github.com/pgvector/pgvector)

Google marks free-tier inputs as usable for product improvement. Index public
content only. Database and Vercel hosting limits/costs are separate.

## Data flow

```mermaid
flowchart TD
  P[Public profile and shared portfolio data] --> C[Clean and chunk text]
  B[Local MDX blog posts] --> C
  C --> E[Gemini document embeddings]
  E --> D[(PostgreSQL + pgvector)]
  Q[Visitor question and bounded history] --> A[Next.js chat API]
  A --> R[Database-backed daily limits]
  R --> V[Gemini query embedding]
  V --> S[Cosine search in PostgreSQL]
  D --> S
  S --> K[Up to four relevant chunks]
  K --> G[Gemini Flash-Lite]
  G --> U[Answer only]
```

Catalog questions such as `ai list all blog posts` read document metadata and
return the full catalog without an embedding or generation request. Topic
questions such as `ai explain the Hyprland socket fix` use semantic retrieval.

## Setup

1. Install dependencies with `npm ci` (or use the maintained pnpm lockfile).
2. Copy `.env.example` to `.env.local` and set `DB_URL` and `GEMINI_API_KEY`.
   Keep the Google API project on the Free tier if you want no paid API usage.
3. Run `npm run db:deploy` to apply migrations. This enables pgvector and adds
   knowledge tables and request-limit counters, leaving comments/views intact.
   Your database provider must make pgvector available and allow the extension.
4. Run `npm run knowledge:index -- --dry-run` to inspect document/chunk counts
   without database writes or Google calls.
5. Run `npm run knowledge:index` to generate and store embeddings.
6. Run `npm run knowledge:check` to check for stale, missing, or deleted sources.
7. Run `npm run dev` and try the terminal's `ai` command.
8. Production Vercel deployments using `npm run build` automatically apply
   migrations and refresh the index after Next.js builds successfully.

These commands load environment variables using Next.js precedence, including
`.env.local`. If your host requires a direct connection for migrations, supply
that connection as `DB_URL` when running `db:deploy`, and use the pooled connection
for the app and indexing. Never commit API keys or connection strings.

## Updating your knowledge

- Edit `content/knowledge/profile.md` for biography and education.
- Edit `lib/portfolio-data.ts` for projects, skills, experience, and contact data.
- Add, update, or remove `content/blog/*.mdx` files as usual.
- Deploy to Vercel production: its build automatically refreshes the index.
- For a local/manual refresh, run `npm run knowledge:index`, then `npm run knowledge:check`.

The original content files remain the source of truth. Content hashes include
source metadata. The indexer skips unchanged documents and generates vectors
before replacing any existing chunks. Each changed document is replaced inside
a transaction. Deleted sources are removed only after all indexing succeeds.
A database lease prevents overlapping indexer processes; a crashed process's
lease expires after two hours. If quota expires partway through, rerun later;
completed documents are skipped and existing unfinished documents are preserved.

Embeddings run sequentially with a 6.5-second pause and up to three attempts on
429/500/503 responses. Persistent quota errors stop the run. No website request
runs the indexer. Production Vercel builds invoke it after compilation. For this collection, the first run normally makes a few dozen
embedding requests and takes several minutes, subject to the project's quota.

The chunker targets 1,800 characters (approximately 300–500 tokens for ordinary
English), with 200 characters of overlap. Paragraph boundaries are preferred;
long blocks are still bounded. Titles are supplied to the embedding API.
Model, dimensions, and chunking version are recorded in `INDEXING_VERSION`;
changing them requires reindexing. Retrieval excludes incompatible versions.

## Retrieval and answers

The query uses the same embedding model and dimensions as indexing. pgvector's
`<=>` operator computes cosine distance. The API retrieves 12 candidates, then
keeps at most four chunks, no more than two per document, within a 7,200-character
text budget. It deduplicates text and applies `RAG_MIN_SIMILARITY` (default 0.60).
This cutoff is an initial setting, not a probability of correctness; calibrate
it against representative supported and unsupported questions after indexing.

Current-work questions (including “now days”, “nowadays”, “current role”, and
“working on”) also retrieve the dedicated `portfolio:current-work` document first.
That document is generated from roles marked `ongoing` in the shared experience
data, so it follows future job changes rather than embedding a fixed answer.
This explicit current-work match is kept even if an awkwardly worded question
scores below the normal semantic threshold. Other results retain the threshold.
Ended roles are labeled as previous work, and the answer prompt prioritizes active
roles for current-status questions. Generic references to “he” or “his” alone no
longer pull an unrelated preceding question into retrieval.

Exact nearest-neighbor search is used for this small collection. An HNSW index
can be added later if measurement shows that the collection needs it.

Only matched chunks are sent to the answer model, along with the current question
and at most four recent question/answer pairs. Follow-up retrieval uses the
previous user question when pronouns refer back to it; this is a lightweight
heuristic, not an extra LLM rewriting call. Assistant history is not used as
retrieval evidence. History stays in browser memory and clears with the terminal
or page reload; it is not stored in the database.

The generation prompt treats retrieved text/history as untrusted data and asks
the model to decline unsupported claims. It returns only the answer, without
citations or source lists; numeric citation markers are also stripped by the API.
Retrieval reads relevant text and titles, without fetching source URLs. The public
chat response does not include source metadata, and the UI displays only the
answer. Grounding reduces hallucinations but does not guarantee model accuracy.
If nothing meets the relevance cutoff, the API returns an unsupported-question
message without calling the answer model.

## Vercel deployment

- Deploy the existing Next.js application normally, using the Node.js runtime.
- Set `DB_URL`, `GEMINI_API_KEY`, and optional RAG settings in Vercel's server
  environment variables. Do not use `NEXT_PUBLIC_` for secrets.
- Use your provider's pooled connection URL. Keep the function and DB near each
  other where possible. The chat function has a 60-second maximum duration;
  Google calls have a 20-second timeout each.
- Keep Vercel's Build Command set to `npm run build` (or `pnpm build`). The script
  runs Next.js first, then `knowledge:sync`. With `VERCEL_ENV=production`, it
  applies pending migrations and runs the incremental indexer against that
  deployment's content. Keep both required environment variables available to
  the production build as well as the running function.
- A failed migration fails the build. A failed indexing run only logs a warning:
  the site still deploys, and chat keeps answering from the previous index, so
  check the build log for `knowledge index NOT refreshed`. Successful changed
  documents may already have been indexed before a later document fails; the next
  deployment or manual index run skips completed work.
- Local and preview builds skip synchronization and do not modify the production
  index. Preview deployments should use a separate database if their content
  differs from production; otherwise their chat reads the production index.
- Changes synchronize on production deployment, not merely when a local file is
  saved. The explicit index command is still available for manual refreshes.
- The API returns 503 while the index is empty or a dependency is unavailable,
  400 for invalid input, 413 for oversized input, and 429 for exhausted quotas.

`RAG_DAILY_REQUEST_LIMIT` defaults to 20 requests for the whole application per
UTC day. Each visitor IP is limited to 10 requests per UTC day. These are
conservative application caps, not Google's published allowance. Counters are
atomic in PostgreSQL and survive Vercel cold starts. The Vercel forwarded IP is
hashed with the UTC date before storage; local development uses `x-forwarded-for`
or a shared `local` identity. Expired chat counters are cleaned up on requests.
Attempts reaching retrieval count even if the downstream API fails. These limits
reduce abuse but are not authentication or full bot protection.

There is no automatic billing upgrade or paid model fallback. Keep the API
project on the Free tier: on a paid project the same model IDs can incur charges.

## Verification

```bash
npm run test:rag
npx tsc --noEmit
npm run lint
npm run build
```

Without `RAG_TEST_DB_URL`, five pure tests run and three database tests skip.
For all eight tests, create an isolated local PostgreSQL with pgvector:

```bash
docker run --rm -d --name portfolio-rag-test \
  -e POSTGRES_PASSWORD=rag_test -e POSTGRES_DB=rag_test \
  -p 127.0.0.1:55439:5432 pgvector/pgvector:pg16
DB_URL=postgresql://postgres:rag_test@127.0.0.1:55439/rag_test npm run db:deploy
RAG_TEST_DB_URL=postgresql://postgres:rag_test@127.0.0.1:55439/rag_test npm run test:rag
docker stop portfolio-rag-test
```

Database tests use synthetic vectors, need no Google quota, and refuse a
non-local database or a database not named `rag_test`. They delete knowledge and
chat-limit fixtures inside that test database. Live quality checks require a
valid Google API key and a populated index; try experience, a specific blog,
a follow-up, the full blog catalog, and an unsupported question.
