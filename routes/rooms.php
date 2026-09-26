<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomScheduleController;
use Illuminate\Support\Facades\Route;

// Owner routes are keyed by integer id and scoped to the signed-in user. The
// numeric constraint makes anything else (such as a public uuid) a plain 404
// at routing time instead of a type error inside the controller.
Route::middleware(['auth', 'verified'])->whereNumber(['room', 'booking'])->group(function () {
    Route::resource('rooms', RoomController::class)->except('show');

    Route::prefix('rooms/{room}')->name('rooms.')->group(function () {
        Route::get('schedule/edit', [RoomScheduleController::class, 'edit'])->name('schedule.edit');
        Route::put('schedule', [RoomScheduleController::class, 'update'])->name('schedule.update');

        Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
        Route::get('bookings/create', [BookingController::class, 'create'])->name('bookings.create');
        Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
        Route::patch('bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    });
});
