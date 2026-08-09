---
name: Artifact paths
description: Which artifact lives at which preview path and how to screenshot them
---

Landing (sales page) is the root artifact at `/`; the resort system lives at `/osrodek/`. Iframes and links on the landing must use the `/osrodek/...` prefix.

**Why:** Paths were swapped so buyers land on the sales page first.

**How to apply:** Screenshot-tool paths are relative to the artifact's previewPath — for the resort app use `path="/?theme=..."`, NOT `/osrodek/?...` (double prefix → 404).
