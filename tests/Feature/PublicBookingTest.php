<?php

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Carbon;

beforeEach(function () {
    // Thursday 24 Sep 2026, 09:00 UTC.
    $this->travelTo(Carbon::parse('2026-09-24 09:00:00'));
});

function bookableRoom(array $roomOverrides = [], array $scheduleOverrides = []): Room
{
    $room = Room::factory()->for(User::factory())->create(array_merge([
        'duration_minutes' => 60,
        'min_players' => 2,
        'max_players' => 6,
    ], $roomOverrides));

    Schedule::factory()->for($room)->create(array_merge([
        'open_days' => [0, 1, 2, 3, 4, 5, 6],
        'open_time' => '10:00',
        'close_time' => '14:00',
        'buffer_minutes' => 30,
        'advance_booking_days' => 30,
        'min_notice_hours' => 2,
    ], $scheduleOverrides));

    return $room->load('schedule');
}

function guestBookingPayload(array $overrides = []): array
{
    return array_merge([
        'starts_at' => '2026-09-26T10:00:00Z',
        'party_size' => 3,
        'customer_name' => 'Ada Lovelace',
        'customer_email' => 'ada@example.com',
        'customer_phone' => '555-0100',
        'notes' => 'Birthday party',
    ], $overrides);
}

describe('public room listing', function () {
    test('guests can see active rooms without logging in', function () {
        $room = bookableRoom(['name' => 'The Lost Tomb']);

        $response = $this->get(route('public.rooms.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('public/rooms/index')
            ->has('rooms.data', 1)
            ->where('rooms.data.0.uuid', $room->uuid)
            ->where('rooms.data.0.name', 'The Lost Tomb')
        );
    });

    test('inactive rooms and rooms with an inactive schedule are hidden', function () {
        bookableRoom(['is_active' => false]);
        bookableRoom([], ['is_active' => false]);
        $visible = bookableRoom();

        $response = $this->get(route('public.rooms.index'));

        $response->assertInertia(fn ($page) => $page
            ->has('rooms.data', 1)
            ->where('rooms.data.0.uuid', $visible->uuid)
        );
    });

    test('listed rooms expose no owner or internal fields', function () {
        bookableRoom();

        $response = $this->get(route('public.rooms.index'));

        $response->assertInertia(fn ($page) => $page
            ->missing('rooms.data.0.id')
            ->missing('rooms.data.0.user_id')
            ->missing('rooms.data.0.slug')
            ->missing('rooms.data.0.image_path')
            ->missing('rooms.data.0.is_active')
        );
    });
});

describe('public room page', function () {
    test('is reachable by uuid for guests', function () {
        $room = bookableRoom();

        $response = $this->get(route('public.rooms.show', $room));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('public/rooms/show')
            ->where('room.uuid', $room->uuid)
            ->where('room.name', $room->name)
        );
    });

    test('is not reachable by the integer id', function () {
        $room = bookableRoom();

        $this->get('/escape-rooms/'.$room->id)->assertNotFound();
    });

    test('returns 404 for an unknown or malformed uuid', function () {
        $this->get('/escape-rooms/'.fake()->uuid())->assertNotFound();
        $this->get('/escape-rooms/not-a-uuid')->assertNotFound();
    });

    test('returns 404 for an inactive room', function () {
        $room = bookableRoom(['is_active' => false]);

        $this->get(route('public.rooms.show', $room))->assertNotFound();
    });

    test('returns 404 when the schedule is inactive', function () {
        $room = bookableRoom([], ['is_active' => false]);

        $this->get(route('public.rooms.show', $room))->assertNotFound();
    });

    test('exposes no owner or internal fields', function () {
        $room = bookableRoom();

        $response = $this->get(route('public.rooms.show', $room));

        $response->assertInertia(fn ($page) => $page
            ->missing('room.id')
            ->missing('room.user_id')
            ->missing('room.slug')
            ->missing('room.image_path')
        );
    });

    test('offers the first bookable date and its slots by default', function () {
        $room = bookableRoom();

        $response = $this->get(route('public.rooms.show', $room));

        // 09:00 now + 2h notice rules out today's 10:00 slot; 11:30 and 13:00 remain.
        // The last day (30 days ahead) has no slot before the 09:00 advance cutoff.
        $response->assertInertia(fn ($page) => $page
            ->where('selected_date', '2026-09-24')
            ->has('dates', 30)
            ->has('slots', 2)
            ->where('slots.0.starts_at', '2026-09-24T11:30:00Z')
            ->where('slots.1.starts_at', '2026-09-24T13:00:00Z')
        );
    });

    test('generates slots spaced by duration plus buffer within open hours', function () {
        $room = bookableRoom();

        $response = $this->get(route('public.rooms.show', [$room, 'date' => '2026-09-26']));

        $response->assertInertia(fn ($page) => $page
            ->where('selected_date', '2026-09-26')
            ->has('slots', 3)
            ->where('slots.0.starts_at', '2026-09-26T10:00:00Z')
            ->where('slots.0.ends_at', '2026-09-26T11:00:00Z')
            ->where('slots.1.starts_at', '2026-09-26T11:30:00Z')
            ->where('slots.2.starts_at', '2026-09-26T13:00:00Z')
            ->where('slots.0.available', true)
        );
    });

    test('marks only the booked slot unavailable when the buffer is respected', function () {
        $room = bookableRoom();
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-26 11:30:00',
            'ends_at' => '2026-09-26 12:30:00',
        ]);

        $response = $this->get(route('public.rooms.show', [$room, 'date' => '2026-09-26']));

        $response->assertInertia(fn ($page) => $page
            ->where('slots.0.available', true)
            ->where('slots.1.available', false)
            ->where('slots.2.available', true)
        );
    });

    test('an off-grid booking blocks every slot within its buffer', function () {
        $room = bookableRoom();
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-26 10:45:00',
            'ends_at' => '2026-09-26 11:45:00',
        ]);

        $response = $this->get(route('public.rooms.show', [$room, 'date' => '2026-09-26']));

        $response->assertInertia(fn ($page) => $page
            ->where('slots.0.available', false)
            ->where('slots.1.available', false)
            ->where('slots.2.available', true)
        );
    });

    test('a cancelled booking does not block its slot', function () {
        $room = bookableRoom();
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-26 11:30:00',
            'ends_at' => '2026-09-26 12:30:00',
            'status' => BookingStatus::Cancelled,
        ]);

        $response = $this->get(route('public.rooms.show', [$room, 'date' => '2026-09-26']));

        $response->assertInertia(fn ($page) => $page
            ->where('slots.0.available', true)
            ->where('slots.1.available', true)
            ->where('slots.2.available', true)
        );
    });

    test('closed days are never offered', function () {
        // Only Mondays (1) are open; 26 Sep 2026 is a Saturday.
        $room = bookableRoom([], ['open_days' => [1]]);

        $response = $this->get(route('public.rooms.show', [$room, 'date' => '2026-09-26']));

        $response->assertInertia(fn ($page) => $page
            ->where('selected_date', '2026-09-28')
            ->where('dates.0', '2026-09-28')
        );
    });

    test('dates beyond the advance booking window are not offered', function () {
        $room = bookableRoom([], ['advance_booking_days' => 3]);

        $response = $this->get(route('public.rooms.show', $room));

        $response->assertInertia(fn ($page) => $page->has('dates', 3));
    });

    test('an unofferable date falls back to the first available date', function () {
        $room = bookableRoom();

        $response = $this->get(route('public.rooms.show', [$room, 'date' => '2030-01-01']));

        $response->assertInertia(fn ($page) => $page->where('selected_date', '2026-09-24'));
    });
});

describe('creating a booking', function () {
    test('a guest can book an open slot and lands on the booking page', function () {
        $room = bookableRoom();

        $response = $this->post(route('public.bookings.store', $room), guestBookingPayload());

        $booking = Booking::query()->sole();
        $response->assertRedirect(route('public.bookings.show', $booking));

        expect($booking->schedule_id)->toBe($room->schedule->id)
            ->and($booking->status)->toBe(BookingStatus::Confirmed)
            ->and($booking->customer_email)->toBe('ada@example.com')
            ->and($booking->starts_at->toIso8601ZuluString())->toBe('2026-09-26T10:00:00Z')
            ->and($booking->ends_at->toIso8601ZuluString())->toBe('2026-09-26T11:00:00Z');
    });

    test('a slot that is already taken is refused', function () {
        $room = bookableRoom();
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-26 10:00:00',
            'ends_at' => '2026-09-26 11:00:00',
        ]);

        $response = $this->post(route('public.bookings.store', $room), guestBookingPayload());

        $response->assertSessionHasErrors('starts_at');
        expect(Booking::query()->count())->toBe(1);
    });

    test('a cancelled slot can be booked again', function () {
        $room = bookableRoom();
        Booking::factory()->for($room->schedule)->create([
            'starts_at' => '2026-09-26 10:00:00',
            'ends_at' => '2026-09-26 11:00:00',
            'status' => BookingStatus::Cancelled,
        ]);

        $this->post(route('public.bookings.store', $room), guestBookingPayload())
            ->assertSessionHasNoErrors();

        expect(Booking::query()->count())->toBe(2);
    });

    test('the party size must fit the room', function () {
        $room = bookableRoom();

        $this->post(route('public.bookings.store', $room), guestBookingPayload(['party_size' => 9]))
            ->assertSessionHasErrors('party_size');

        $this->post(route('public.bookings.store', $room), guestBookingPayload(['party_size' => 1]))
            ->assertSessionHasErrors('party_size');
    });

    test('a time outside opening hours is refused', function () {
        $room = bookableRoom();

        $this->post(route('public.bookings.store', $room), guestBookingPayload(['starts_at' => '2026-09-26T07:00:00Z']))
            ->assertSessionHasErrors('starts_at');

        $this->post(route('public.bookings.store', $room), guestBookingPayload(['starts_at' => '2026-09-26T13:30:00Z']))
            ->assertSessionHasErrors('starts_at');
    });

    test('a time that breaks the notice or advance limits is refused', function () {
        $room = bookableRoom();

        $this->post(route('public.bookings.store', $room), guestBookingPayload(['starts_at' => '2026-09-24T10:00:00Z']))
            ->assertSessionHasErrors('starts_at');

        $this->post(route('public.bookings.store', $room), guestBookingPayload(['starts_at' => '2026-11-30T10:00:00Z']))
            ->assertSessionHasErrors('starts_at');
    });

    test('a closed day is refused', function () {
        $room = bookableRoom([], ['open_days' => [1]]);

        $this->post(route('public.bookings.store', $room), guestBookingPayload())
            ->assertSessionHasErrors('starts_at');
    });

    test('customer details are required', function () {
        $room = bookableRoom();

        $this->post(route('public.bookings.store', $room), guestBookingPayload([
            'customer_name' => '',
            'customer_email' => 'not-an-email',
        ]))->assertSessionHasErrors(['customer_name', 'customer_email']);

        expect(Booking::query()->count())->toBe(0);
    });

    test('an inactive room cannot be booked', function () {
        $room = bookableRoom(['is_active' => false]);

        $this->post(route('public.bookings.store', $room), guestBookingPayload())->assertNotFound();

        expect(Booking::query()->count())->toBe(0);
    });

    test('a room cannot be booked by its integer id', function () {
        $room = bookableRoom();

        $this->post('/escape-rooms/'.$room->id.'/bookings', guestBookingPayload())->assertNotFound();
    });

    test('booking requests are rate limited', function () {
        $room = bookableRoom();

        foreach (range(1, 10) as $attempt) {
            $this->post(route('public.bookings.store', $room), guestBookingPayload(['customer_name' => '']));
        }

        $this->post(route('public.bookings.store', $room), guestBookingPayload())->assertTooManyRequests();
    });
});

describe('public booking page', function () {
    test('is reachable by uuid without logging in', function () {
        $room = bookableRoom(['name' => 'Prison Break']);
        $booking = Booking::factory()->for($room->schedule)->create(['customer_name' => 'Grace Hopper']);

        $response = $this->get(route('public.bookings.show', $booking));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('public/bookings/show')
            ->where('booking.uuid', $booking->uuid)
            ->where('booking.customer_name', 'Grace Hopper')
            ->where('booking.status', 'confirmed')
            ->where('booking.room.name', 'Prison Break')
            ->where('booking.room.uuid', $room->uuid)
            ->where('booking.room.is_bookable', true)
        );
    });

    test('is not reachable by the integer id', function () {
        $room = bookableRoom();
        $booking = Booking::factory()->for($room->schedule)->create();

        $this->get('/booking/'.$booking->id)->assertNotFound();
    });

    test('returns 404 for an unknown or malformed uuid', function () {
        $this->get('/booking/'.fake()->uuid())->assertNotFound();
        $this->get('/booking/not-a-uuid')->assertNotFound();
    });

    test('exposes no contact details or internal ids', function () {
        $room = bookableRoom();
        $booking = Booking::factory()->for($room->schedule)->create();

        $response = $this->get(route('public.bookings.show', $booking));

        $response->assertInertia(fn ($page) => $page
            ->missing('booking.id')
            ->missing('booking.customer_email')
            ->missing('booking.customer_phone')
            ->missing('booking.notes')
            ->missing('booking.cancellation_reason')
            ->missing('booking.room.id')
        );
    });

    test('is kept out of search engines, caches and referrers', function () {
        $room = bookableRoom();
        $booking = Booking::factory()->for($room->schedule)->create();

        $response = $this->get(route('public.bookings.show', $booking));

        $response->assertHeader('X-Robots-Tag', 'noindex, nofollow');
        $response->assertHeader('Referrer-Policy', 'no-referrer');
        expect($response->headers->get('Cache-Control'))->toContain('no-store');
    });

    test('lookups are rate limited', function () {
        $room = bookableRoom();
        $booking = Booking::factory()->for($room->schedule)->create();

        foreach (range(1, 60) as $attempt) {
            $this->get(route('public.bookings.show', $booking))->assertOk();
        }

        $this->get(route('public.bookings.show', $booking))->assertTooManyRequests();
    });

    test('public room pages stay indexable', function () {
        $room = bookableRoom();

        $response = $this->get(route('public.rooms.show', $room));

        $response->assertHeaderMissing('X-Robots-Tag');
    });

    test('shows a cancelled booking as cancelled', function () {
        $room = bookableRoom();
        $booking = Booking::factory()->for($room->schedule)->create([
            'status' => BookingStatus::Cancelled,
            'cancelled_at' => now(),
        ]);

        $response = $this->get(route('public.bookings.show', $booking));

        $response->assertInertia(fn ($page) => $page->where('booking.status', 'cancelled'));
    });

    test('still shows the booking when its room is switched off', function () {
        $room = bookableRoom(['is_active' => false]);
        $booking = Booking::factory()->for($room->schedule)->create();

        $response = $this->get(route('public.bookings.show', $booking));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->where('booking.room.is_bookable', false));
    });
});
