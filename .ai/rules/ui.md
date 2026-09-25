---
paths:
  - 'resources/js/components/ui/**'
---

# Ui

## Vendored shadcn ui/ files are hand-edited and excluded from Biome
Files in components/ui are vendored shadcn primitives: they use double quotes and 2-space indent, and biome.json excludes them from formatting and linting, so do not reformat them. They may still be edited for behavior (for example cursor-pointer on interactive elements).
Before deleting a ui/ file as unused, grep for imports with BOTH quote styles (`ui/name"` and `ui/name'`): vendored files import with double quotes, and a single-quote-only grep wrongly flagged skeleton.tsx as dead.
