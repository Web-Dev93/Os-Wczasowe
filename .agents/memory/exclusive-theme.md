---
name: Exclusive theme tokens
description: How the dark luxury (exclusive) theme handles primary color tokens without breaking shared components
---

Rule: keep `--primary-foreground` DARK globally in the exclusive theme (gold buttons need dark text). Sections styled `bg-primary` are overridden to a dark background, so light text there must be applied via scoped rules (`section.bg-primary`, `[class*="text-primary-foreground"]`), never by flipping the global token.

**Why:** Flipping `--primary-foreground` to light once broke every default gold Button, badge, and admin nav highlight (light-on-gold, poor contrast). Scoped rules fixed the dark stats/CTA sections without regressions.

**How to apply:** Any new dark-background section in exclusive that reuses `bg-primary`/`text-primary-foreground` needs its own scoped color override in `artifacts/osrodek/src/index.css`.
