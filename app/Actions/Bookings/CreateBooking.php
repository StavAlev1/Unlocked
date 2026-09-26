<?php

namespace App\Actions\Bookings;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateBooking
{
    /**
     * Create a confirmed booking for the room's schedule, refusing any time
     * that overlaps an active (non-cancelled) booking.
     *
     * The schedule row is locked for the duration of the transaction so two
     * simultaneous requests for the same room cannot both pass the overlap
     * check and double-book a slot.
     *
     * @param  array<string, mixed>  $attributes
     *
     * @throws ValidationException
     */
    public function handle(Room $room, CarbonInterface $startsAt, array $attributes): Booking
    {
        $schedule = $room->schedule;
        $endsAt = $startsAt->clone()->addMinutes($room->duration_minutes);

        return DB::transaction(function () use ($schedule, $startsAt, $endsAt, $attributes): Booking {
            Schedule::query()->whereKey($schedule->id)->lockForUpdate()->first();

            $overlaps = $schedule->bookings()
                ->active()
                ->where('starts_at', '<', $endsAt)
                ->where('ends_at', '>', $startsAt)
                ->exists();

            if ($overlaps) {
                throw ValidationException::withMessages([
                    'starts_at' => __('This time is no longer available.'),
                ]);
            }

            return $schedule->bookings()->create([
                ...$attributes,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'status' => BookingStatus::Confirmed,
            ]);
        });
    }
}
