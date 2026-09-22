<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_id' => Room::factory(),
            'open_days' => [0, 1, 2, 3, 4, 5, 6],
            'open_time' => '10:00',
            'close_time' => '20:00',
            'buffer_minutes' => 15,
            'advance_booking_days' => 30,
            'min_notice_hours' => 2,
            'timezone' => 'UTC',
            'is_active' => true,
        ];
    }
}
