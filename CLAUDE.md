# BragMe — agent notes

**Workflow:** Always commit on `main`. Push to `origin` after each completed numbered step. No feature branches.

**Stack pins:** Next 16.2, React 19, Tailwind v4, Anthropic SDK with model `claude-sonnet-4-6`, Neon Postgres + Drizzle ORM (server-only via `DATABASE_URL`).

**Next.js 16 caveat:** Read `node_modules/next/dist/docs/` for any API route / config / metadata change before relying on training data — there are breaking changes from Next 15.

**UX language:** All product UI copy is **English** (Gen-Z, main character energy). Talk to the user (PO) in **Korean**.

**Schema source of truth:** `src/db/schema.ts` (Drizzle). Generate migrations into `drizzle/` via `npm run db:generate`. Never hand-edit generated SQL.

**Don't bikeshed:** the spec in conversation memory is the canonical brief. Defer refactors and abstraction until the 9-step build is shippable end-to-end.
