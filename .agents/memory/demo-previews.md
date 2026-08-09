---
name: Demo preview conventions
description: How theme/demo query params drive public and admin previews for the landing showcase
---

`?theme=X&demo=1` forces a theme (persisted in sessionStorage) and demo mode across the resort app. This works for BOTH the public site and the admin panel: `useAdminTheme` honors the URL theme before falling back to saved settings, and `/admin/login?demo=1` auto-logs-in via `POST /api/admin/demo-login`.

**Why:** The landing page showcase embeds both site and admin previews per style; without URL-theme support in admin, buyers saw the configured theme instead of the selected one.

**How to apply:** Any new preview surface should pass `theme` + `demo=1` through and rely on `use-theme.ts` helpers. Note: demo-login works in production too (user decision, Aug 2026 — sales page must show the admin panel). Login.tsx falls back to the password form if demo-login fails. Risk accepted: any visitor can get an admin session on the published demo; mitigated by demo-data-reset plans.
