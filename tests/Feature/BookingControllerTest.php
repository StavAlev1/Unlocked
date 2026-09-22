<?php

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;

function createRoomWithSchedule(User $user, array $roomOverrides = [], array $scheduleOverrides = []): Room
{
    $room = Room::factory()->for($user)->create($roomOverrides);
    Schedule::factory()->for($room)->create($scheduleOverrides);

    return $room;
}

function validBookingPayload(array $overrides = []): array
{
    return array_merge([
        'party_size' => 2,
        'customer_name' => 'Jane Doe',
        'customer_email' => 'jane@example.com',
        'customer_phone' => '555-1234',
        'notes' => null,
    ], $overrides);
}

test('guests are redirected to the login page', function () {
    $room = Room::factory()->create();

    $response = $this->get(route('rooms.bookings.index', $room));

    $response->assertRedirect(route('login'));
});

describe('index', function () {
    test('a different user gets a 404 when viewing another user room bookings', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = createRoomWithSchedule($owner);

        $response = $this->actingAs($otherUser)->get(route('rooms.bookings.index', $room));

        $response->assertNotFound();
    });

    test('only shows bookings for the owner\'s room', function () {
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user);
        $booking = Booking::factory()->for($room->schedule)->create(['starts_at' => now()->addDay()->setTime(12, 0)]);

        $otherRoom = createRoomWithSchedule($user);
        Booking::factory()->for($otherRoom->schedule)->create(['starts_at' => now()->addDay()->setTime(13, 0)]);

        $response = $this->actingAs($user)->get(route('rooms.bookings.index', $room));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.id', $booking->id)
        );
    });

    test('search filters bookings by customer name or email', function () {
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user);
        $match = Booking::factory()->for($room->schedule)->create([
            'starts_at' => now()->addDay()->setTime(12, 0),
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
        ]);
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => now()->addDay()->setTime(14, 0),
            'customer_name' => 'John Smith',
            'customer_email' => 'john@example.com',
        ]);

        $response = $this->actingAs($user)->get(route('rooms.bookings.index', ['room' => $room, 'search' => 'jane']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.id', $match->id)
        );
    });
});

describe('create', function () {
    test('the owner can view the create booking page', function () {
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user);

        $response = $this->actingAs($user)->get(route('rooms.bookings.create', $room));

        $response->assertOk();
    });

    test('a different user gets a 404 when viewing another user room create page', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = createRoomWithSchedule($owner);

        $response = $this->actingAs($otherUser)->get(route('rooms.bookings.create', $room));

        $response->assertNotFound();
    });
});

describe('store', function () {
    test('a different user gets a 404 when booking another user room', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = createRoomWithSchedule($owner, ['duration_minutes' => 60]);

        $this->travelTo('2026-09-22 08:00:00');

        $response = $this->actingAs($otherUser)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:00:00',
        ]));

        $response->assertNotFound();
        expect(Booking::count())->toBe(0);
    });

    test('a valid submission creates a confirmed booking with the correct ends_at', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, [
            'duration_minutes' => 60,
            'min_players' => 2,
            'max_players' => 6,
        ]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:00:00',
            'party_size' => 3,
        ]));

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('rooms.bookings.index', $room));

        $booking = Booking::where('schedule_id', $room->schedule->id)->firstOrFail();
        expect($booking->status)->toBe(BookingStatus::Confirmed);
        expect($booking->party_size)->toBe(3);
        expect($booking->starts_at->toDateTimeString())->toBe('2026-09-23 12:00:00');
        expect($booking->ends_at->toDateTimeString())->toBe('2026-09-23 13:00:00');
    });

    test('party_size below the room minimum fails validation', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, [
            'duration_minutes' => 60,
            'min_players' => 2,
            'max_players' => 6,
        ]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:00:00',
            'party_size' => 1,
        ]));

        $response->assertSessionHasErrors('party_size');
        expect(Booking::count())->toBe(0);
    });

    test('party_size above the room maximum fails validation', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, [
            'duration_minutes' => 60,
            'min_players' => 2,
            'max_players' => 6,
        ]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:00:00',
            'party_size' => 7,
        ]));

        $response->assertSessionHasErrors('party_size');
        expect(Booking::count())->toBe(0);
    });

    test('party_size at the exact min or max boundary is accepted', function (int $partySize) {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, [
            'duration_minutes' => 60,
            'min_players' => 2,
            'max_players' => 6,
        ]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:00:00',
            'party_size' => $partySize,
        ]));

        $response->assertSessionHasNoErrors();
        expect(Booking::count())->toBe(1);
    })->with([
        'minimum' => [2],
        'maximum' => [6],
    ]);

    test('starts_at that violates the minimum notice period fails validation', function () {
        $this->travelTo('2026-09-23 10:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, ['duration_minutes' => 60]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 11:00:00',
        ]));

        $response->assertSessionHasErrors('starts_at');
        expect(Booking::count())->toBe(0);
    });

    test('starts_at beyond the advance booking window fails validation', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, ['duration_minutes' => 60]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-10-23 12:00:00',
        ]));

        $response->assertSessionHasErrors('starts_at');
        expect(Booking::count())->toBe(0);
    });

    test('starts_at on a day the schedule is closed fails validation', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, ['duration_minutes' => 60], ['open_days' => [1, 2, 3, 4, 5]]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-26 12:00:00',
        ]));

        $response->assertSessionHasErrors('starts_at');
        expect(Booking::count())->toBe(0);
    });

    test('starts_at where the session would not finish before closing fails validation', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, ['duration_minutes' => 60]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 19:30:00',
        ]));

        $response->assertSessionHasErrors('starts_at');
        expect(Booking::count())->toBe(0);
    });

    test('a second booking at the exact same start time is rejected', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, [
            'duration_minutes' => 60,
            'min_players' => 2,
            'max_players' => 6,
        ]);
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-23 12:00:00',
            'party_size' => 2,
        ]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:00:00',
        ]));

        $response->assertSessionHasErrors('starts_at');
        expect(Booking::where('schedule_id', $room->schedule->id)->count())->toBe(1);
    });

    test('a second booking with an overlapping but different start time is rejected', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, [
            'duration_minutes' => 60,
            'min_players' => 2,
            'max_players' => 6,
        ]);
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-23 12:00:00',
            'party_size' => 2,
        ]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:30:00',
        ]));

        $response->assertSessionHasErrors('starts_at');
        expect(Booking::where('schedule_id', $room->schedule->id)->count())->toBe(1);
    });

    test('a cancelled booking does not block a new booking that overlaps its original time', function () {
        $this->travelTo('2026-09-22 08:00:00');
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user, [
            'duration_minutes' => 60,
            'min_players' => 2,
            'max_players' => 6,
        ]);
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-23 12:00:00',
            'party_size' => 2,
            'status' => BookingStatus::Cancelled,
            'cancelled_at' => now(),
        ]);

        $response = $this->actingAs($user)->post(route('rooms.bookings.store', $room), validBookingPayload([
            'starts_at' => '2026-09-23 12:15:00',
        ]));

        $response->assertSessionHasNoErrors();
        expect(Booking::where('schedule_id', $room->schedule->id)->where('status', BookingStatus::Confirmed)->count())->toBe(1);
    });
});

describe('cancel', function () {
    test('a different user gets a 404 when cancelling another user room booking', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = createRoomWithSchedule($owner);
        $booking = Booking::factory()->for($room->schedule)->create();

        $response = $this->actingAs($otherUser)->patch(route('rooms.bookings.cancel', [$room, $booking]));

        $response->assertNotFound();
        expect($booking->fresh()->status)->toBe(BookingStatus::Confirmed);
    });

    test('the owner can cancel their own room booking', function () {
        $user = User::factory()->create();
        $room = createRoomWithSchedule($user);
        $booking = Booking::factory()->for($room->schedule)->create();

        $response = $this->actingAs($user)->patch(route('rooms.bookings.cancel', [$room, $booking]), [
            'cancellation_reason' => 'Customer requested a refund.',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('rooms.bookings.index', $room));

        $booking->refresh();
        expect($booking->status)->toBe(BookingStatus::Cancelled);
        expect($booking->cancelled_at)->not->toBeNull();
        expect($booking->cancellation_reason)->toBe('Customer requested a refund.');
        expect(Booking::find($booking->id))->not->toBeNull();
    });
});
