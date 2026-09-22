<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Http\Requests\CancelBookingRequest;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display a listing of the room's bookings.
     */
    public function index(Request $request, int $room): Response
    {
        $room = $request->user()->rooms()->findOrFail($room);
        $schedule = $room->schedule()->firstOrCreate([], Schedule::defaultAttributes());

        $search = $request->string('search')->trim()->toString();

        $bookings = $schedule->bookings()
            ->when($search !== '', fn ($query) => $query->where(
                fn ($query) => $query->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%")
            ))
            ->orderByDesc('starts_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('rooms/bookings/index', [
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'slug' => $room->slug,
            ],
            'bookings' => $bookings,
            'filters' => ['search' => $search],
            'timezone' => $schedule->timezone,
        ]);
    }

    /**
     * Show the form for creating a new booking.
     */
    public function create(Request $request, int $room): Response
    {
        $room = $request->user()->rooms()->findOrFail($room);
        $schedule = $room->schedule()->firstOrCreate([], Schedule::defaultAttributes());

        return Inertia::render('rooms/bookings/create', [
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'slug' => $room->slug,
                'duration_minutes' => $room->duration_minutes,
                'min_players' => $room->min_players,
                'max_players' => $room->max_players,
            ],
            'schedule' => [
                'open_days' => $schedule->open_days,
                'open_time' => $schedule->open_time,
                'close_time' => $schedule->close_time,
                'advance_booking_days' => $schedule->advance_booking_days,
                'min_notice_hours' => $schedule->min_notice_hours,
                'timezone' => $schedule->timezone,
            ],
        ]);
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(StoreBookingRequest $request, int $room): RedirectResponse
    {
        $room = $request->room();
        $schedule = $room->schedule;

        $startsAt = $request->date('starts_at');
        $endsAt = $startsAt->clone()->addMinutes($room->duration_minutes);

        DB::transaction(function () use ($request, $schedule, $startsAt, $endsAt): void {
            $overlaps = $schedule->bookings()
                ->active()
                ->where('starts_at', '<', $endsAt)
                ->where('ends_at', '>', $startsAt)
                ->exists();

            if ($overlaps) {
                throw ValidationException::withMessages([
                    'starts_at' => __('This time is no longer available.'),
                ]);
            }

            $schedule->bookings()->create([
                ...$request->safe()->only(['party_size', 'customer_name', 'customer_email', 'customer_phone', 'notes']),
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'status' => BookingStatus::Confirmed,
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Booking created.')]);

        return to_route('rooms.bookings.index', $room);
    }

    /**
     * Cancel the specified booking.
     */
    public function cancel(CancelBookingRequest $request, int $room, int $booking): RedirectResponse
    {
        $room = $request->user()->rooms()->findOrFail($room);
        $booking = $room->schedule->bookings()->findOrFail($booking);

        $this->authorize('cancel', $booking);

        $booking->update([
            'status' => BookingStatus::Cancelled,
            'cancelled_at' => now(),
            'cancellation_reason' => $request->validated('cancellation_reason'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Booking cancelled.')]);

        return to_route('rooms.bookings.index', $room);
    }
}
