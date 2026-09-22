<?php

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function validRoomPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'The Vault',
        'description' => 'A thrilling heist-themed escape room.',
        'difficulty' => 'moderate',
        'duration_minutes' => 60,
        'min_players' => 2,
        'max_players' => 6,
        'price_cents' => 4500,
        'is_active' => 'on',
    ], $overrides);
}

test('guests are redirected to the login page', function () {
    $response = $this->get(route('rooms.index'));

    $response->assertRedirect(route('login'));
});

describe('index', function () {
    test('only shows rooms owned by the authenticated user', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();
        Room::factory()->create();

        $response = $this->actingAs($user)->get(route('rooms.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('rooms.data', 1)
            ->where('rooms.data.0.id', $room->id)
        );
    });

    test('search filters rooms by name', function () {
        $user = User::factory()->create();
        $match = Room::factory()->for($user)->create(['name' => 'Prison Break']);
        Room::factory()->for($user)->create(['name' => 'Haunted Manor']);

        $response = $this->actingAs($user)->get(route('rooms.index', ['search' => 'prison']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('rooms.data', 1)
            ->where('rooms.data.0.id', $match->id)
        );
    });
});

describe('store', function () {
    test('creates a room owned by the authenticated user', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('rooms.store'), validRoomPayload());

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('rooms.index'));

        $room = Room::where('name', 'The Vault')->firstOrFail();
        expect($room->user_id)->toBe($user->id);
        expect($room->slug)->toBe('the-vault');
    });

    test('is_active defaults to false when the checkbox is not sent', function () {
        $user = User::factory()->create();
        $payload = validRoomPayload();
        unset($payload['is_active']);

        $this->actingAs($user)->post(route('rooms.store'), $payload);

        $room = Room::where('name', 'The Vault')->firstOrFail();
        expect($room->is_active)->toBeFalse();
    });

    test('required fields must be present', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('rooms.store'), []);

        $response->assertSessionHasErrors([
            'name', 'description', 'difficulty', 'duration_minutes',
            'min_players', 'max_players', 'price_cents',
        ]);
    });

    test('max_players below min_players fails validation', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('rooms.store'), validRoomPayload([
            'min_players' => 5,
            'max_players' => 3,
        ]));

        $response->assertSessionHasErrors('max_players');
    });

    test('duplicate names for the same user produce unique slugs', function () {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('rooms.store'), validRoomPayload());
        $this->actingAs($user)->post(route('rooms.store'), validRoomPayload());

        $slugs = Room::where('user_id', $user->id)->pluck('slug')->sort()->values();
        expect($slugs->all())->toBe(['the-vault', 'the-vault-2']);
    });

    test('duplicate names for different users do not collide', function () {
        $userOne = User::factory()->create();
        $userTwo = User::factory()->create();

        $this->actingAs($userOne)->post(route('rooms.store'), validRoomPayload());
        $this->actingAs($userTwo)->post(route('rooms.store'), validRoomPayload());

        $roomOne = Room::where('user_id', $userOne->id)->firstOrFail();
        $roomTwo = Room::where('user_id', $userTwo->id)->firstOrFail();

        expect($roomOne->slug)->toBe('the-vault');
        expect($roomTwo->slug)->toBe('the-vault');
    });

    test('uploads and stores the room image', function () {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('rooms.store'), validRoomPayload([
            'image' => UploadedFile::fake()->image('room.jpg'),
        ]));

        $room = Room::where('name', 'The Vault')->firstOrFail();
        expect($room->image_path)->not->toBeNull();
        Storage::disk('public')->assertExists($room->image_path);
    });
});

describe('edit', function () {
    test('the owner can view the edit page', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        $response = $this->actingAs($user)->get(route('rooms.edit', $room));

        $response->assertOk();
    });

    test('a different user gets a 404 when viewing another user room edit page', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = Room::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser)->get(route('rooms.edit', $room));

        $response->assertNotFound();
    });
});

describe('update', function () {
    test('the owner can update their own room', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create(['name' => 'Old Name']);

        $response = $this->actingAs($user)->put(route('rooms.update', $room), validRoomPayload([
            'name' => 'Old Name',
            'price_cents' => 9999,
        ]));

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('rooms.index'));

        expect($room->fresh()->price_cents)->toBe(9999);
    });

    test('updating without changing the name keeps the existing slug', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create(['name' => 'Old Name', 'slug' => 'old-name']);

        $response = $this->actingAs($user)->put(route('rooms.update', $room), validRoomPayload([
            'name' => 'Old Name',
        ]));

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('rooms.index'));
        expect($room->fresh()->slug)->toBe('old-name');
    });

    test('updating with a new name regenerates the slug', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create(['name' => 'Old Name', 'slug' => 'old-name']);

        $response = $this->actingAs($user)->put(route('rooms.update', $room), validRoomPayload([
            'name' => 'Brand New Name',
        ]));

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('rooms.index'));
        expect($room->fresh()->slug)->toBe('brand-new-name');
    });

    test('replacing the image deletes the old file and stores the new one', function () {
        Storage::fake('public');
        $user = User::factory()->create();
        $oldPath = UploadedFile::fake()->image('old.jpg')->store('rooms', 'public');
        $room = Room::factory()->for($user)->create(['image_path' => $oldPath]);

        $this->actingAs($user)->put(route('rooms.update', $room), validRoomPayload([
            'name' => $room->name,
            'image' => UploadedFile::fake()->image('new.jpg'),
        ]));

        $room->refresh();
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($room->image_path);
        expect($room->image_path)->not->toBe($oldPath);
    });

    test('a different user gets a 404 when updating another user room', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = Room::factory()->for($owner)->create(['price_cents' => 1000]);

        $response = $this->actingAs($otherUser)->put(route('rooms.update', $room), validRoomPayload());

        $response->assertNotFound();
        expect($room->fresh()->price_cents)->toBe(1000);
    });
});

describe('destroy', function () {
    test('the owner can delete their own room', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        $response = $this->actingAs($user)->delete(route('rooms.destroy', $room));

        $response->assertRedirect(route('rooms.index'));
        expect($room->fresh())->toBeNull();
    });

    test('a room with a future confirmed booking cannot be deleted', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();
        $schedule = Schedule::factory()->for($room)->create();
        Booking::factory()->for($schedule)->create([
            'starts_at' => now()->addDay(),
            'status' => BookingStatus::Confirmed,
        ]);

        $response = $this->actingAs($user)
            ->from(route('rooms.index'))
            ->delete(route('rooms.destroy', $room));

        $response->assertSessionHasErrors('room');
        expect($room->fresh())->not->toBeNull();
    });

    test('a different user gets a 404 when deleting another user room', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = Room::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser)->delete(route('rooms.destroy', $room));

        $response->assertNotFound();
        expect($room->fresh())->not->toBeNull();
    });
});
