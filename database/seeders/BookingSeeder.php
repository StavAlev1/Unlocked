<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BookingSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Day offsets (relative to today) used for the demo bookings. Negative
     * offsets land in the past (a mix of completed and cancelled), positive
     * offsets land in the future (confirmed, upcoming) so the dashboard
     * calendar has something to show in every direction.
     *
     * @var array<int, int>
     */
    private const PAST_DAY_OFFSETS = [-21, -14, -9, -5, -2];

    /**
     * @var array<int, int>
     */
    private const FUTURE_DAY_OFFSETS = [1, 3, 6, 9, 13, 17, 22, 28];

    /**
     * Seed dummy bookings for the admin user's rooms, so the dashboard has
     * something to render. Safe to re-run: it only ever adds bookings, it
     * never touches existing ones.
     */
    public function run(): void
    {
        $user = User::where('is_admin', true)->first();

        if ($user === null) {
            $this->command?->warn('No admin user found — skipping BookingSeeder.');

            return;
        }

        $rooms = $user->rooms()->with('schedule')->get();

        foreach ($rooms as $room) {
            // Rooms created through the seeder (rather than the "new room"
            // form) never went through RoomController::store, so they may
            // not have a schedule yet — the same defensive fallback the
            // controllers use.
            $schedule = $room->schedule ?? $room->schedule()->create(Schedule::defaultAttributes());

            $this->seedForRoom($room, $schedule);
        }
    }

    private function seedForRoom(Room $room, Schedule $schedule): void
    {
        foreach (self::PAST_DAY_OFFSETS as $offset) {
            $date = $this->nextOpenDay($schedule, Carbon::now()->addDays($offset));
            $startsAt = $this->randomSlot($schedule, $room, $date);
            $isCancelled = fake()->boolean(25);

            Booking::factory()->for($schedule)->create([
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->clone()->addMinutes($room->duration_minutes),
                'status' => $isCancelled ? BookingStatus::Cancelled : BookingStatus::Confirmed,
                'cancelled_at' => $isCancelled ? $startsAt->clone()->subDay() : null,
                'cancellation_reason' => $isCancelled ? 'Customer requested to reschedule.' : null,
            ]);
        }

        foreach (self::FUTURE_DAY_OFFSETS as $offset) {
            $date = $this->nextOpenDay($schedule, Carbon::now()->addDays($offset));
            $startsAt = $this->randomSlot($schedule, $room, $date);

            Booking::factory()->for($schedule)->create([
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->clone()->addMinutes($room->duration_minutes),
                'status' => BookingStatus::Confirmed,
            ]);
        }
    }

    /**
     * Roll a date forward (at most a week) until it lands on one of the
     * schedule's open days.
     */
    private function nextOpenDay(Schedule $schedule, Carbon $date): Carbon
    {
        $openDays = array_map('intval', $schedule->open_days);
        $date = $date->clone()->startOfDay();

        for ($i = 0; $i < 7; $i++) {
            if (in_array($date->dayOfWeek, $openDays, true)) {
                return $date;
            }

            $date->addDay();
        }

        return $date;
    }

    /**
     * Pick a random session start time on the given date that fits inside
     * the schedule's open hours and the room's play duration.
     */
    private function randomSlot(Schedule $schedule, Room $room, Carbon $date): Carbon
    {
        $open = Carbon::parse($date->toDateString().' '.$schedule->open_time);
        $close = Carbon::parse($date->toDateString().' '.$schedule->close_time);
        $latestStart = $close->clone()->subMinutes($room->duration_minutes);

        if ($latestStart->lessThanOrEqualTo($open)) {
            return $open;
        }

        $stepMinutes = 15;
        $steps = intdiv($open->diffInMinutes($latestStart), $stepMinutes);

        return $open->clone()->addMinutes(fake()->numberBetween(0, max(0, $steps)) * $stepMinutes);
    }
}
