---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Scope owned resources through the authenticated user and 404
Resolve rooms, schedules and bookings through the owner's relationship, e.g. `$request->user()->rooms()->findOrFail($room)` and `$room->schedule->bookings()->findOrFail($booking)`. Do not use bare route-model binding on Room/Booking for owner endpoints.
Another user's record must return 404, not 403, so the existence of other users' data is never revealed. Cross-room listings scope by `whereHas('schedule.room', fn ($q) => $q->where('user_id', ...))`. Checkbox fields are read with `$request->boolean()`.
