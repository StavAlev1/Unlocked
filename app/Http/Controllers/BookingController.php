<?php

namespace App\Http\Controllers;

use App\Actions\Bookings\CreateBooking;
use App\Enums\BookingStatus;
use App\Http\Requests\CancelBookingRequest;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display a listing of every booking across all of the user's rooms,
     * with filters — the cross-room counterpart to index() below.
     */
    public function all(Request $request): Response
    {
        $user = $request->user();

        $search = $request->string('search')->trim()->toString();
        $roomId = $request->integer('room') ?: null;
        $status = $request->string('status')->toString();
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();

        $status = in_array($status, ['confirmed', 'cancelled'], true) ? $status : '';
        $from = preg_match('/^\d{4}-\d{2}-\d{2}$/', $from) === 1 ? $from : '';
        $to = preg_match('/^\d{4}-\d{2}-\d{2}$/', $to) === 1 ? $to : '';

        $bookings = Booking::query()
            ->whereHas('schedule.room', fn ($query) => $query->where('user_id', $user->id))
            ->when($roomId, fn ($query) => $query->whereHas(
                'schedule',
                fn ($query) => $query->where('room_id', $roomId)
            ))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($from !== '', fn ($query) => $query->whereDate('starts_at', '>=', $from))
            ->when($to !== '', fn ($query) => $query->whereDate('starts_at', '<=', $to))
            ->when($search !== '', fn ($query) => $query->where(
                fn ($query) => $query->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%")
            ))
            ->with('schedule.room:id,name,slug')
            ->orderBy('starts_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Booking $booking) => [
                'id' => $booking->id,
                'starts_at' => $booking->starts_at->toIso8601String(),
                'ends_at' => $booking->ends_at->toIso8601String(),
                'party_size' => $booking->party_size,
                'status' => $booking->status->value,
                'customer_name' => $booking->customer_name,
                'customer_email' => $booking->customer_email,
                'room' => [
                    'id' => $booking->schedule->room->id,
                    'name' => $booking->schedule->room->name,
                    'slug' => $booking->schedule->room->slug,
                ],
            ]);

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'rooms' => $user->rooms()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'room' => $roomId,
                'status' => $status,
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }

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
    public function store(StoreBookingRequest $request, CreateBooking $createBooking, int $room): RedirectResponse
    {
        $room = $request->room();

        $createBooking->handle(
            $room,
            $request->date('starts_at'),
            $request->safe()->only(['party_size', 'customer_name', 'customer_email', 'customer_phone', 'notes']),
        );

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
