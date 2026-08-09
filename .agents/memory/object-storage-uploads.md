---
name: Object storage upload conventions
description: Admin uploads (logo/favicon) flow and ACL model in the resort system
---

Upload flow (admin-only): POST `/api/storage/uploads/request-url` (requireAdmin) → PUT file to presigned URL → POST `/api/storage/uploads/finalize` (requireAdmin) which sets ACL `{owner:'admin', visibility:'public'}`.

Rule: `GET /api/storage/objects/*` only serves objects with a public ACL policy (or an admin session). An uploaded object that is never finalized returns 404 to visitors.

**Why:** private-dir objects must not be publicly retrievable by default; site assets (logo, favicon) are explicitly marked public.

**How to apply:** any new upload feature must call finalize after upload, or add its own ACL policy. Store `/api/storage/objects/...` URLs in the DB (root-relative works from both `/` and `/osrodek/`).
