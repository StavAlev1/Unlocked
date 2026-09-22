<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.users.index'));

    $response->assertRedirect(route('login'));
});

test('non-admin users are forbidden', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->get(route('admin.users.index'));

    $response->assertForbidden();
});

describe('index', function () {
    test('admins can view the users list', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->create(['name' => 'Jane Doe']);

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
    });

    test('search filters users by name or email', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $match = User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
        User::factory()->create(['name' => 'John Smith', 'email' => 'john@example.com']);

        $response = $this->actingAs($admin)->get(route('admin.users.index', ['search' => 'jane']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.id', $match->id)
        );
    });
});

describe('store', function () {
    test('admins can create a user', function () {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'new-user@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'is_admin' => 'on',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.users.index'));

        $user = User::where('email', 'new-user@example.com')->firstOrFail();
        expect($user->name)->toBe('New User');
        expect($user->is_admin)->toBeTrue();
        expect(Hash::check('password', $user->password))->toBeTrue();
    });

    test('is_admin defaults to false when the checkbox is not sent', function () {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'new-user@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::where('email', 'new-user@example.com')->firstOrFail();
        expect($user->is_admin)->toBeFalse();
    });

    test('required fields must be present', function () {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post(route('admin.users.store'), []);

        $response->assertSessionHasErrors(['name', 'email', 'password']);
    });

    test('email must be unique', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $existing = User::factory()->create();

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => $existing->email,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
    });
});

describe('update', function () {
    test('admins can update a user', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create(['name' => 'Old Name', 'is_admin' => false]);

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => 'New Name',
            'email' => $user->email,
            'is_admin' => 'on',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.users.index'));

        $user->refresh();
        expect($user->name)->toBe('New Name');
        expect($user->is_admin)->toBeTrue();
    });

    test('password is only changed when a new one is provided', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();
        $originalPassword = $user->password;

        $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => $user->name,
            'email' => $user->email,
        ]);

        expect($user->fresh()->password)->toBe($originalPassword);
    });

    test('admins cannot change their own admin access', function () {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->put(route('admin.users.update', $admin), [
            'name' => $admin->name,
            'email' => $admin->email,
        ]);

        expect($admin->fresh()->is_admin)->toBeTrue();
    });
});

describe('destroy', function () {
    test('admins can delete another user', function () {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $user));

        $response->assertRedirect(route('admin.users.index'));
        expect($user->fresh())->toBeNull();
    });

    test('admins cannot delete their own account', function () {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin));

        $response->assertForbidden();
        expect($admin->fresh())->not->toBeNull();
    });
});
