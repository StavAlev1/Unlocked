<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard, with a calendar of the current month's
     * confirmed bookings across every room the user owns, plus a short
     * chronological list of what's coming up next.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $requestedMonth = $request->string('month')->toString();
        $monthStart = preg_match('/^\d{4}-\d{2}$/', $requestedMonth) === 1
            ? Carbon::createFromFormat('Y-m', $requestedMonth)->startOfMonth()
            : now()->startOfMonth();
        $monthEnd = $monthStart->clone()->endOfMonth();

        $scheduleIds = Schedule::query()
            ->whereHas('room', fn ($query) => $query->where('user_id', $user->id))
            ->pluck('id');

        $calendarBookings = Booking::query()
            ->whereIn('schedule_id', $scheduleIds)
            ->where('status', BookingStatus::Confirmed)
            ->whereBetween('starts_at', [$monthStart, $monthEnd])
            ->with('schedule.room:id,name,slug')
            ->orderBy('starts_at')
            ->get()
            ->map($this->present(...));

        $upcomingBookings = Booking::query()
            ->whereIn('schedule_id', $scheduleIds)
            ->where('status', BookingStatus::Confirmed)
            ->where('starts_at', '>=', now())
            ->with('schedule.room:id,name,slug')
            ->orderBy('starts_at')
            ->limit(8)
            ->get()
            ->map($this->present(...));

        return Inertia::render('dashboard', [
            'month' => $monthStart->format('Y-m'),
            'calendarBookings' => $calendarBookings,
            'upcomingBookings' => $upcomingBookings,
            'hasAnyRooms' => $scheduleIds->isNotEmpty(),
        ]);
    }

    /**
     * Shape a booking for the dashboard's JSON props.
     *
     * @return array<string, mixed>
     */
    private function present(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'starts_at' => $booking->starts_at->toIso8601String(),
            'ends_at' => $booking->ends_at->toIso8601String(),
            'party_size' => $booking->party_size,
            'status' => $booking->status->value,
            'customer_name' => $booking->customer_name,
            'room' => [
                'id' => $booking->schedule->room->id,
                'name' => $booking->schedule->room->name,
                'slug' => $booking->schedule->room->slug,
            ],
        ];
    }
}
