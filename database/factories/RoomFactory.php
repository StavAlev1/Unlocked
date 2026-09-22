<?php

namespace Database\Factories;

use App\Enums\RoomDifficulty;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * A small curated list of escape-room-ish names, used to keep generated
     * rooms feeling realistic.
     *
     * @var array<int, string>
     */
    protected array $names = [
        'The Lost Tomb',
        'Prison Break',
        'Haunted Manor',
        'Heist of the Century',
        'Wizard\'s Library',
        'Deep Sea Distress',
        'Mad Scientist\'s Lab',
        'Pirate\'s Cove',
        'Cursed Casino',
        'Zombie Outbreak',
        'Spy Academy',
        'Ancient Temple',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement($this->names);
        $minPlayers = fake()->numberBetween(1, 4);

        return [
            'user_id' => User::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 999999),
            'description' => fake()->sentence(15),
            'difficulty' => fake()->randomElement(RoomDifficulty::cases()),
            'duration_minutes' => fake()->randomElement([45, 60, 75, 90]),
            'min_players' => $minPlayers,
            'max_players' => fake()->numberBetween($minPlayers, 8),
            'price_cents' => fake()->numberBetween(2000, 8000),
            'image_path' => null,
            'is_active' => true,
        ];
    }
}
