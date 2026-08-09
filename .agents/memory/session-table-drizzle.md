---
name: Session table vs drizzle push
description: Why admin login breaks after drizzle push-force and how the session table is guaranteed
---

Rule: never rely on connect-pg-simple `createTableIfMissing` — the api-server is bundled with esbuild and the store's `table.sql` is missing at runtime (ENOENT), which silently poisons ALL session saves (login returns 200 + Set-Cookie but nothing persists → 401 loops).

**Why:** `drizzle-kit push --force` drops the `session` table because it is not in the ORM schema; the store then can't recreate it from the bundle.

**How to apply:** `artifacts/api-server/src/index.ts` runs `CREATE TABLE IF NOT EXISTS "session"...` DDL at startup before listening (createTableIfMissing is false). After any forced drizzle push, restart the API server. Applies to production too — the DDL runs on boot there.
