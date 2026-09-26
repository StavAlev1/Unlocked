<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use Illuminate\Support\Str;

test('a new room gets a random uuid', function () {
    $room = Room::factory()->create();

    expect(Str::isUuid($room->uuid))->toBeTrue()
        ->and(Str::isUuid($room->fresh()->uuid))->toBeTrue();
});

test('a new booking gets a random uuid', function () {
    $schedule = Schedule::factory()->create();
    $booking = Booking::factory()->for($schedule)->create();

    expect(Str::isUuid($booking->uuid))->toBeTrue();
});

test('every room and booking gets a different uuid', function () {
    $rooms = Room::factory()->count(3)->create();

    expect($rooms->pluck('uuid')->unique())->toHaveCount(3);
});

test('the uuid is version 4 so it reveals nothing about creation time', function () {
    $room = Room::factory()->create();

    expect($room->uuid[14])->toBe('4');
});

test('the integer id stays the primary key', function () {
    $room = Room::factory()->create();

    expect($room->getKeyName())->toBe('id')
        ->and($room->getIncrementing())->toBeTrue()
        ->and($room->id)->toBeInt();
});

test('the uuid cannot be mass assigned', function () {
    $room = Room::factory()->create();

    $room->fill(['uuid' => 'not-a-real-uuid']);

    expect($room->uuid)->not->toBe('not-a-real-uuid');
});
