---
paths:
  - 'resources/{js,css}/**'
---

# Jscss

## Use Vault theme tokens, not hardcoded hex colors
Colors come from the CSS variables in resources/css/app.css (light in :root, dark in .dark). Use semantic classes such as bg-primary, text-primary-foreground, text-muted-foreground, border-border instead of arbitrary hex like bg-[#5A4FE8], so a palette change is one edit. Primary is a violet-blue; muted-foreground is a violet-tinted gray.
Fonts: Space Grotesk (font-display) for headings, IBM Plex Mono (font-mono-data) for real data, Instrument Sans (font-sans) for body.
Known exception: pages/welcome.tsx still hardcodes hex and should be migrated to tokens when touched.
