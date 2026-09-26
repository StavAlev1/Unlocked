<?php

use App\Http\Controllers\PublicBookingController;
use App\Http\Controllers\PublicRoomController;
use App\Http\Middleware\AddPrivateLinkHeaders;
use Illuminate\Support\Facades\Route;

Route::get('escape-rooms', [PublicRoomController::class, 'index'])->name('public.rooms.index');
Route::get('escape-rooms/{room:uuid}', [PublicRoomController::class, 'show'])->name('public.rooms.show');
Route::post('escape-rooms/{room:uuid}/bookings', [PublicBookingController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('public.bookings.store');

Route::get('booking/{booking:uuid}', [PublicBookingController::class, 'show'])
    ->middleware(['throttle:60,1', AddPrivateLinkHeaders::class])
    ->name('public.bookings.show');
