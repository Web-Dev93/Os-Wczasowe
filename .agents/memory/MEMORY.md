# Memory Index

- [Exclusive theme tokens](exclusive-theme.md) — bg-primary sections get dark bg via override, so light text must be scoped to those sections; never flip --primary-foreground globally.
- [Demo preview conventions](demo-previews.md) — ?theme=X&demo=1 drives public AND admin previews (admin auto-login via /api/admin/demo-login, disabled in production); useAdminTheme honors URL theme.
- [Artifact paths](artifact-paths.md) — landing lives at /, resort system at /osrodek/; screenshot paths are relative to previewPath (don't double-prefix).
