<?php

namespace App\Support;

use App\Models\Room;
use Illuminate\Support\Carbon;

/**
 * Works out which start times a customer can book for a room, from its
 * schedule (open days and hours, buffer, notice and advance limits) and its
 * existing active bookings. Times are handled in UTC, like the rest of the
 * booking flow.
 */
class BookableSlots
{
    /**
     * The furthest ahead, in days, that dates are ever offered.
     */
    public const MAX_DAYS_AHEAD = 60;

    /**
     * Get the dates (Y-m-d) that still have at least one slot that meets the
     * schedule's notice and advance-booking limits.
     *
     * @return array<int, string>
     */
    public function dates(Room $room): array
    {
        $schedule = $room->schedule;
        $today = Carbon::now()->startOfDay();
        $days = min($schedule->advance_booking_days, self::MAX_DAYS_AHEAD);
        $dates = [];

        for ($offset = 0; $offset <= $days; $offset++) {
            $day = $today->clone()->addDays($offset);

            if ($this->slotStarts($room, $day) !== []) {
                $dates[] = $day->toDateString();
            }
        }

        return $dates;
    }

    /**
     * Get every slot on the given date, flagged with whether it is still free.
     * A booking blocks the slots that fall within the schedule's buffer of it.
     *
     * @return array<int, array{starts_at: string, ends_at: string, available: bool}>
     */
    public function forDate(Room $room, Carbon $date): array
    {
        $starts = $this->slotStarts($room, $date);

        if ($starts === []) {
            return [];
        }

        $schedule = $room->schedule;
        $duration = $room->duration_minutes;
        $buffer = $schedule->buffer_minutes;

        $bookings = $schedule->bookings()
            ->active()
            ->where('starts_at', '<', $starts[array_key_last($starts)]->clone()->addMinutes($duration + $buffer))
            ->where('ends_at', '>', $starts[0]->clone()->subMinutes($buffer))
            ->get(['starts_at', 'ends_at']);

        return array_map(function (Carbon $start) use ($bookings, $duration, $buffer): array {
            $end = $start->clone()->addMinutes($duration);
            $blockedFrom = $start->clone()->subMinutes($buffer);
            $blockedUntil = $end->clone()->addMinutes($buffer);

            $isTaken = $bookings->contains(
                fn ($booking): bool => $booking->starts_at < $blockedUntil && $booking->ends_at > $blockedFrom
            );

            return [
                'starts_at' => $start->toIso8601ZuluString(),
                'ends_at' => $end->toIso8601ZuluString(),
                'available' => ! $isTaken,
            ];
        }, $starts);
    }

    /**
     * Get the slot start times for a date, ignoring existing bookings.
     *
     * @return array<int, Carbon>
     */
    private function slotStarts(Room $room, Carbon $date): array
    {
        $schedule = $room->schedule;
        $openDays = array_map('intval', $schedule->open_days);

        if (! in_array($date->dayOfWeek, $openDays, true)) {
            return [];
        }

        $now = Carbon::now();
        $earliest = $now->clone()->addHours($schedule->min_notice_hours);
        $latest = $now->clone()->addDays($schedule->advance_booking_days);

        $day = $date->toDateString();
        $latestStart = Carbon::parse($day.' '.$schedule->close_time)->subMinutes($room->duration_minutes);
        $step = $room->duration_minutes + $schedule->buffer_minutes;

        $starts = [];

        for ($start = Carbon::parse($day.' '.$schedule->open_time); $start <= $latestStart; $start = $start->clone()->addMinutes($step)) {
            if ($start >= $earliest && $start <= $latest) {
                $starts[] = $start;
            }
        }

        return $starts;
    }
}
