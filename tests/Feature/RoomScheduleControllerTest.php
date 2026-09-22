<?php

use App\Models\Room;
use App\Models\User;

function validSchedulePayload(array $overrides = []): array
{
    return array_merge([
        'open_days' => [0, 1, 2, 3, 4, 5, 6],
        'open_time' => '09:00',
        'close_time' => '21:00',
        'buffer_minutes' => 10,
        'advance_booking_days' => 60,
        'min_notice_hours' => 4,
        'timezone' => 'America/New_York',
        'is_active' => 'on',
    ], $overrides);
}

test('guests are redirected to the login page', function () {
    $room = Room::factory()->create();

    $response = $this->get(route('rooms.schedule.edit', $room));

    $response->assertRedirect(route('login'));
});

describe('edit', function () {
    test('the owner can view the schedule edit page', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        $response = $this->actingAs($user)->get(route('rooms.schedule.edit', $room));

        $response->assertOk();
    });

    test('loads without error when the room has no schedule row yet', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        expect($room->schedule)->toBeNull();

        $response = $this->actingAs($user)->get(route('rooms.schedule.edit', $room));

        $response->assertOk();
        expect($room->schedule()->exists())->toBeTrue();
    });

    test('a different user gets a 404 when viewing another user schedule edit page', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = Room::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser)->get(route('rooms.schedule.edit', $room));

        $response->assertNotFound();
    });
});

describe('update', function () {
    test('the owner can update the schedule and changes persist', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        $response = $this->actingAs($user)->put(route('rooms.schedule.update', $room), validSchedulePayload());

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('rooms.schedule.edit', $room));

        $schedule = $room->schedule()->firstOrFail();
        expect($schedule->open_days)->toBe([0, 1, 2, 3, 4, 5, 6]);
        expect($schedule->open_time)->toBe('09:00');
        expect($schedule->close_time)->toBe('21:00');
        expect($schedule->buffer_minutes)->toBe(10);
        expect($schedule->advance_booking_days)->toBe(60);
        expect($schedule->min_notice_hours)->toBe(4);
        expect($schedule->timezone)->toBe('America/New_York');
        expect($schedule->is_active)->toBeTrue();
    });

    test('a different user gets a 404 when updating another user schedule', function () {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $room = Room::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser)->put(route('rooms.schedule.update', $room), validSchedulePayload());

        $response->assertNotFound();
    });

    test('close_time must be after open_time', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        $response = $this->actingAs($user)->put(route('rooms.schedule.update', $room), validSchedulePayload([
            'open_time' => '20:00',
            'close_time' => '10:00',
        ]));

        $response->assertSessionHasErrors('close_time');
    });

    test('open_days rejects an out-of-range day', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        $response = $this->actingAs($user)->put(route('rooms.schedule.update', $room), validSchedulePayload([
            'open_days' => [0, 7],
        ]));

        $response->assertSessionHasErrors('open_days.1');
    });

    test('open_days rejects duplicate values', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();

        $response = $this->actingAs($user)->put(route('rooms.schedule.update', $room), validSchedulePayload([
            'open_days' => [1, 1],
        ]));

        $response->assertSessionHasErrors('open_days.0');
    });

    test('is_active is set to false when the checkbox is not sent', function () {
        $user = User::factory()->create();
        $room = Room::factory()->for($user)->create();
        $payload = validSchedulePayload();
        unset($payload['is_active']);

        $this->actingAs($user)->put(route('rooms.schedule.update', $room), $payload);

        expect($room->schedule()->firstOrFail()->is_active)->toBeFalse();
    });
});
