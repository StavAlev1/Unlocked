---
paths:
  - 'resources/js/**/*.{ts,tsx}'
---

# Js

## Format booking dates in UTC and avoid Intl style shorthand
Booking times are stored and validated in UTC (Schedule.timezone is only a display hint). Every Intl.DateTimeFormat that renders a booking time must pass explicit `timeZone: 'UTC'`, and any per-day grouping must use UTC getters (getUTCFullYear etc.), never the viewer's local timezone.
Never combine `dateStyle`/`timeStyle` with `timeZoneName`: it throws "Invalid option" during Node SSR. Spell out year/month/day/hour/minute instead.
