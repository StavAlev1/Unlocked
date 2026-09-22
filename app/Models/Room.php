<?php

namespace App\Models;

use App\Enums\RoomDifficulty;
use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property RoomDifficulty $difficulty
 * @property int $duration_minutes
 * @property int $min_players
 * @property int $max_players
 * @property int $price_cents
 * @property string|null $image_path
 * @property-read string|null $image_url
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'slug', 'description', 'difficulty', 'duration_minutes', 'min_players', 'max_players', 'price_cents', 'image_path', 'is_active'])]
class Room extends Model
{
    /** @use HasFactory<RoomFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $appends = ['image_url'];

    /**
     * Get the user that owns the room.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the schedule for the room.
     *
     * @return HasOne<Schedule, $this>
     */
    public function schedule(): HasOne
    {
        return $this->hasOne(Schedule::class);
    }

    /**
     * Get the publicly accessible URL for the room's image, if one is set.
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn (): ?string => $this->image_path === null
                ? null
                : Storage::disk('public')->url($this->image_path),
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'difficulty' => RoomDifficulty::class,
            'is_active' => 'boolean',
            'price_cents' => 'integer',
        ];
    }
}
