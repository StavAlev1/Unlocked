<?php

namespace App\Http\Controllers;

use App\Actions\Bookings\CreateBooking;
use App\Http\Requests\StorePublicBookingRequest;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublicBookingController extends Controller
{
    /**
     * Store a booking made by a customer and send them to its confirmation page.
     */
    public function store(StorePublicBookingRequest $request, CreateBooking $createBooking, Room $room): RedirectResponse
    {
        $booking = $createBooking->handle(
            $request->room(),
            $request->date('starts_at'),
            $request->safe()->only(['party_size', 'customer_name', 'customer_email', 'customer_phone', 'notes']),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Your booking is confirmed.')]);

        return to_route('public.bookings.show', $booking);
    }

    /**
     * Display a booking to whoever holds its private link.
     */
    public function show(Booking $booking): Response
    {
        $booking->load('schedule.room');
        $room = $booking->schedule->room;

        return Inertia::render('public/bookings/show', [
            'booking' => [
                'uuid' => $booking->uuid,
                'starts_at' => $booking->starts_at->toIso8601ZuluString(),
                'ends_at' => $booking->ends_at->toIso8601ZuluString(),
                'party_size' => $booking->party_size,
                'status' => $booking->status->value,
                'customer_name' => $booking->customer_name,
                'room' => [
                    'uuid' => $room->uuid,
                    'name' => $room->name,
                    'image_url' => $room->image_url,
                    'is_bookable' => $room->is_active && $booking->schedule->is_active,
                ],
            ],
        ]);
    }
}
