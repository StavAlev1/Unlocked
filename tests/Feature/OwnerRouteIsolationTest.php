<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Routing\Route as LaravelRoute;
use Illuminate\Support\Facades\Route;

/*
 * Owners are kept apart by scoping every query through the signed-in user
 * (and answering 404 for anyone else's records), NOT by the public uuids.
 * The uuids only stop strangers guessing ids on the public pages. These tests
 * pin down that the two never get mixed up.
 */

dataset('owner routes given a uuid instead of an id', [
    'edit room' => ['GET', '/rooms/{room-uuid}/edit'],
    'update room' => ['PUT', '/rooms/{room-uuid}'],
    'delete room' => ['DELETE', '/rooms/{room-uuid}'],
    'room bookings' => ['GET', '/rooms/{room-uuid}/bookings'],
    'new booking form' => ['GET', '/rooms/{room-uuid}/bookings/create'],
    'store booking' => ['POST', '/rooms/{room-uuid}/bookings'],
    'edit schedule' => ['GET', '/rooms/{room-uuid}/schedule/edit'],
    'update schedule' => ['PUT', '/rooms/{room-uuid}/schedule'],
    'cancel booking by uuid' => ['PATCH', '/rooms/{room-id}/bookings/{booking-uuid}/cancel'],
    'cancel booking in room by uuid' => ['PATCH', '/rooms/{room-uuid}/bookings/{booking-uuid}/cancel'],
]);

test('owner routes answer 404, not a server error, when given a uuid', function (string $method, string $uri) {
    $owner = User::factory()->create();
    $room = Room::factory()->for($owner)->create();
    $schedule = Schedule::factory()->for($room)->create();
    $booking = Booking::factory()->for($schedule)->create();

    $uri = strtr($uri, [
        '{room-uuid}' => $room->uuid,
        '{room-id}' => (string) $room->id,
        '{booking-uuid}' => $booking->uuid,
    ]);

    $this->actingAs($owner)->call($method, $uri)->assertNotFound();
})->with('owner routes given a uuid instead of an id');

test('a non-numeric id on an owner route is a 404', function () {
    $owner = User::factory()->create();

    $this->actingAs($owner)->get('/rooms/abc/edit')->assertNotFound();
});

test('knowing a public uuid gives another owner no access to owner pages', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $room = Room::factory()->for($owner)->create();
    Schedule::factory()->for($room)->create();

    $this->actingAs($intruder)->get('/rooms/'.$room->uuid.'/edit')->assertNotFound();
    $this->actingAs($intruder)->get(route('rooms.edit', $room))->assertNotFound();
});

test('every signed-in route with a room or booking parameter only accepts integers', function () {
    $checked = 0;

    /** @var LaravelRoute $route */
    foreach (Route::getRoutes()->getRoutes() as $route) {
        if (! in_array('auth', $route->gatherMiddleware(), true)) {
            continue;
        }

        foreach (array_intersect($route->parameterNames(), ['room', 'booking']) as $parameter) {
            expect($route->wheres[$parameter] ?? null)
                ->toBe('[0-9]+', "{$route->uri()} must constrain {{$parameter}} to integers");

            $checked++;
        }
    }

    expect($checked)->toBeGreaterThan(0);
});

test('every public route with a room or booking parameter is looked up by uuid', function () {
    $checked = 0;

    /** @var LaravelRoute $route */
    foreach (Route::getRoutes()->getRoutes() as $route) {
        if (! str_starts_with($route->getName() ?? '', 'public.')) {
            continue;
        }

        foreach (array_intersect($route->parameterNames(), ['room', 'booking']) as $parameter) {
            expect($route->bindingFieldFor($parameter))
                ->toBe('uuid', "{$route->uri()} must bind {{$parameter}} by uuid");

            $checked++;
        }
    }

    expect($checked)->toBeGreaterThan(0);
});
