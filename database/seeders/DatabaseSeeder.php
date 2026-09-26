<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Safe to re-run: the demo users are only created when they do not exist.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->seedUser('Test User', 'test@example.com');

        // An owner still waiting for approval, to try out the approval flow.
        $this->seedUser('Pending Owner', 'pending@example.com', pending: true);

        $this->call(RoomSeeder::class);
        $this->call(BookingSeeder::class);
    }

    /**
     * Create a demo user (password "password") unless the email is taken.
     */
    private function seedUser(string $name, string $email, bool $pending = false): void
    {
        if (User::where('email', $email)->exists()) {
            return;
        }

        $factory = $pending ? User::factory()->pending() : User::factory();

        $factory->create(['name' => $name, 'email' => $email]);
    }
}
