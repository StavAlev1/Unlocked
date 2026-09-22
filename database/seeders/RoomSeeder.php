<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
use App\Support\RoomPlaceholderImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class RoomSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     *
     * Gives every existing user (store) a handful of rooms, each with a
     * generated placeholder cover image. If no users exist yet, creates a
     * few first so there's something to attach rooms to.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $users = User::factory(3)->create();
        }

        $users->each(function (User $user): void {
            Room::factory()
                ->count(fake()->numberBetween(3, 6))
                ->for($user)
                ->create()
                ->each($this->attachPlaceholderImage(...));
        });
    }

    /**
     * Generate and store a placeholder cover image for a seeded room.
     */
    private function attachPlaceholderImage(Room $room): void
    {
        $path = "rooms/{$room->slug}.svg";

        Storage::disk('public')->put(
            $path,
            RoomPlaceholderImage::svg($room->name, $room->difficulty)
        );

        $room->update(['image_path' => $path]);
    }
}
