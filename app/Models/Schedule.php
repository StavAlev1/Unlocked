<?php

namespace App\Models;

use Database\Factories\ScheduleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $room_id
 * @property array<int, int> $open_days
 * @property string $open_time
 * @property string $close_time
 * @property int $buffer_minutes
 * @property int $advance_booking_days
 * @property int $min_notice_hours
 * @property string $timezone
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['open_days', 'open_time', 'close_time', 'buffer_minutes', 'advance_booking_days', 'min_notice_hours', 'timezone', 'is_active'])]
class Schedule extends Model
{
    /** @use HasFactory<ScheduleFactory> */
    use HasFactory;

    /**
     * Get the room that owns the schedule.
     *
     * @return BelongsTo<Room, $this>
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the bookings made against the schedule.
     *
     * @return HasMany<Booking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the default attributes assigned to a newly created room's schedule.
     *
     * @return array<string, mixed>
     */
    public static function defaultAttributes(): array
    {
        return [
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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'open_days' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
