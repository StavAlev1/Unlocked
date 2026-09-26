<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Carbon;

beforeEach(function () {
    // Thursday 24 Sep 2026, 09:00 UTC.
    $this->travelTo(Carbon::parse('2026-09-24 09:00:00'));
});

function roomOwnedBy(User $owner, array $roomOverrides = []): Room
{
    $room = Room::factory()->for($owner)->create(array_merge([
        'duration_minutes' => 60,
        'min_players' => 2,
        'max_players' => 6,
    ], $roomOverrides));

    Schedule::factory()->for($room)->create([
        'open_days' => [0, 1, 2, 3, 4, 5, 6],
        'open_time' => '10:00',
        'close_time' => '14:00',
        'buffer_minutes' => 30,
    ]);

    return $room->load('schedule');
}

function approvalBookingPayload(): array
{
    return [
        'starts_at' => '2026-09-26T10:00:00Z',
        'party_size' => 3,
        'customer_name' => 'Ada Lovelace',
        'customer_email' => 'ada@example.com',
    ];
}

describe('approval state', function () {
    test('factory users are approved by default and can be made pending', function () {
        expect(User::factory()->create()->approved_at)->not->toBeNull()
            ->and(User::factory()->pending()->create()->approved_at)->toBeNull();
    });

    test('an approved user is approved and a pending user is not', function () {
        expect(User::factory()->create()->isApproved())->toBeTrue()
            ->and(User::factory()->pending()->create()->isApproved())->toBeFalse();
    });

    test('administrators are always approved, even without an approval date', function () {
        $admin = User::factory()->pending()->create(['is_admin' => true]);

        expect($admin->approved_at)->toBeNull()
            ->and($admin->isApproved())->toBeTrue();
    });

    test('the approved scope matches isApproved', function () {
        $approved = User::factory()->create();
        $admin = User::factory()->pending()->create(['is_admin' => true]);
        User::factory()->pending()->create();

        expect(User::query()->approved()->pluck('id')->all())
            ->toEqualCanonicalizing([$approved->id, $admin->id]);
    });

    test('approve and revokeApproval change the approval date', function () {
        $user = User::factory()->pending()->create();

        $user->approve();
        expect($user->fresh()->isApproved())->toBeTrue();

        $user->revokeApproval();
        expect($user->fresh()->isApproved())->toBeFalse();
    });

    test('the approval date cannot be mass assigned', function () {
        expect((new User)->getFillable())->not->toContain('approved_at');
    });
});

describe('how users become approved', function () {
    test('someone who registers themselves starts out pending', function () {
        $this->post(route('register.store'), [
            'name' => 'New Owner',
            'email' => 'owner@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::where('email', 'owner@example.com')->firstOrFail();

        expect($user->approved_at)->toBeNull()
            ->and($user->isApproved())->toBeFalse();
    });

    test('a user created by an administrator is approved straight away', function () {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'Hand Picked',
            'email' => 'picked@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasNoErrors();

        expect(User::where('email', 'picked@example.com')->firstOrFail()->isApproved())->toBeTrue();
    });

    test('a pending owner receives their approval state in the shared props', function () {
        $pending = User::factory()->pending()->create();

        $this->actingAs($pending)->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page->where('auth.user.approved_at', null));
    });
});

describe('public visibility', function () {
    test('rooms of a pending owner are not listed publicly', function () {
        roomOwnedBy(User::factory()->pending()->create());

        $this->get(route('public.rooms.index'))
            ->assertInertia(fn ($page) => $page->has('rooms.data', 0));
    });

    test('rooms of an approved owner are listed publicly', function () {
        $room = roomOwnedBy(User::factory()->create());

        $this->get(route('public.rooms.index'))
            ->assertInertia(fn ($page) => $page
                ->has('rooms.data', 1)
                ->where('rooms.data.0.uuid', $room->uuid));
    });

    test('rooms of an administrator are listed even without an approval date', function () {
        $room = roomOwnedBy(User::factory()->pending()->create(['is_admin' => true]));

        $this->get(route('public.rooms.index'))
            ->assertInertia(fn ($page) => $page->where('rooms.data.0.uuid', $room->uuid));
    });

    test('the room page of a pending owner is a 404', function () {
        $room = roomOwnedBy(User::factory()->pending()->create());

        $this->get(route('public.rooms.show', $room))->assertNotFound();
    });

    test('a room of a pending owner cannot be booked', function () {
        $room = roomOwnedBy(User::factory()->pending()->create());

        $this->post(route('public.bookings.store', $room), approvalBookingPayload())->assertNotFound();

        expect(Booking::query()->count())->toBe(0);
    });

    test('an existing booking stays viewable when its owner is not approved', function () {
        $owner = User::factory()->create();
        $room = roomOwnedBy($owner);
        $booking = Booking::factory()->for($room->schedule)->create();

        $owner->revokeApproval();

        $this->get(route('public.bookings.show', $booking))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('booking.room.is_bookable', false));
    });

    test('approving an owner publishes their rooms and revoking hides them again', function () {
        $owner = User::factory()->pending()->create();
        $room = roomOwnedBy($owner);

        $this->get(route('public.rooms.show', $room))->assertNotFound();

        $owner->approve();
        $this->get(route('public.rooms.show', $room))->assertOk();

        $owner->revokeApproval();
        $this->get(route('public.rooms.show', $room))->assertNotFound();
    });

    test('a pending owner can still manage their own rooms', function () {
        $pending = User::factory()->pending()->create();
        $room = roomOwnedBy($pending);

        $this->actingAs($pending)->get(route('rooms.index'))->assertOk();
        $this->actingAs($pending)->get(route('rooms.edit', $room))->assertOk();
    });
});

describe('administrator actions', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->pending()->create();

        $this->post(route('admin.users.approval.store', $user))->assertRedirect(route('login'));
        $this->delete(route('admin.users.approval.destroy', $user))->assertRedirect(route('login'));
    });

    test('non-admin users cannot approve or revoke', function () {
        $owner = User::factory()->create();
        $pending = User::factory()->pending()->create();

        $this->actingAs($owner)->post(route('admin.users.approval.store', $pending))->assertForbidden();
        $this->actingAs($owner)->delete(route('admin.users.approval.destroy', $owner))->assertForbidden();

        expect($pending->fresh()->isApproved())->toBeFalse()
            ->and($owner->fresh()->isApproved())->toBeTrue();
    });

    test('an administrator can approve a pending owner', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $pending = User::factory()->pending()->create();

        $this->actingAs($admin)->from(route('admin.users.index'))
            ->post(route('admin.users.approval.store', $pending))
            ->assertRedirect(route('admin.users.index'));

        expect($pending->fresh()->approved_at)->not->toBeNull();
    });

    test('an administrator can revoke an approved owner', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $owner = User::factory()->create();

        $this->actingAs($admin)->delete(route('admin.users.approval.destroy', $owner))
            ->assertRedirect();

        expect($owner->fresh()->approved_at)->toBeNull();
    });

    test('an administrator cannot revoke an administrator', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $other = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->delete(route('admin.users.approval.destroy', $other))->assertForbidden();

        expect($other->fresh()->approved_at)->not->toBeNull();
    });

    test('approving an unknown user is a 404', function () {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post('/admin/users/999999/approval')->assertNotFound();
        $this->actingAs($admin)->post('/admin/users/not-a-user/approval')->assertNotFound();
    });

    test('the users list puts pending owners first and counts them', function () {
        $admin = User::factory()->create(['is_admin' => true, 'name' => 'Aaron Admin']);
        User::factory()->create(['name' => 'Alice Approved']);
        $pending = User::factory()->pending()->create(['name' => 'Zed Pending']);

        $this->actingAs($admin)->get(route('admin.users.index'))
            ->assertInertia(fn ($page) => $page
                ->where('pendingCount', 1)
                ->where('users.data.0.id', $pending->id));
    });

    test('administrators are not counted as pending', function () {
        $admin = User::factory()->pending()->create(['is_admin' => true]);

        $this->actingAs($admin)->get(route('admin.users.index'))
            ->assertInertia(fn ($page) => $page->where('pendingCount', 0));
    });
});

describe('the publicly bookable rule', function () {
    test('the query scope and the instance method agree for every combination', function () {
        $owners = [
            'approved owner' => fn () => User::factory()->create(),
            'pending owner' => fn () => User::factory()->pending()->create(),
            'administrator without an approval date' => fn () => User::factory()->pending()->create(['is_admin' => true]),
        ];

        $expected = [];

        foreach ($owners as $ownerLabel => $makeOwner) {
            $ownerIsApproved = $ownerLabel !== 'pending owner';
            $owner = $makeOwner();

            foreach ([true, false] as $roomActive) {
                foreach ([true, false] as $scheduleActive) {
                    $room = Room::factory()->for($owner)->create(['is_active' => $roomActive]);
                    Schedule::factory()->for($room)->create(['is_active' => $scheduleActive]);

                    $expected[$room->id] = $ownerIsApproved && $roomActive && $scheduleActive;
                }
            }
        }

        $viaMethod = Room::query()->with(['schedule', 'user'])->get()
            ->mapWithKeys(fn (Room $room) => [$room->id => $room->isPubliclyBookable()])
            ->all();

        $viaScope = Room::query()->publiclyBookable()->pluck('id')->all();

        expect($viaMethod)->toEqual($expected)
            ->and($viaScope)->toEqualCanonicalizing(array_keys(array_filter($expected)));
    });

    test('a room without a schedule is not publicly bookable', function () {
        $room = Room::factory()->for(User::factory()->create())->create(['is_active' => true]);

        expect($room->isPubliclyBookable())->toBeFalse()
            ->and(Room::query()->publiclyBookable()->count())->toBe(0);
    });
});
