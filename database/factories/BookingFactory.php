<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = Carbon::now()
            ->addDays(fake()->numberBetween(1, 14))
            ->setTime(fake()->numberBetween(10, 18), fake()->randomElement([0, 30]));

        return [
            'schedule_id' => Schedule::factory(),
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->clone()->addMinutes(60),
            'party_size' => fake()->numberBetween(2, 4),
            'status' => BookingStatus::Confirmed,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->phoneNumber(),
            'notes' => null,
        ];
    }

    /**
     * Configure the model factory to keep derived attributes consistent
     * with the room the booking's schedule belongs to.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (Booking $booking): void {
            $room = $booking->schedule?->room;

            if ($room === null) {
                return;
            }

            $booking->ends_at = $booking->starts_at->clone()->addMinutes($room->duration_minutes);
            $booking->party_size = max($room->min_players, min($room->max_players, $booking->party_size));
        });
    }
}
