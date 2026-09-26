<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Support\BookableSlots;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PublicRoomController extends Controller
{
    /**
     * Display every room that is open for booking.
     */
    public function index(): Response
    {
        $rooms = Room::query()
            ->publiclyBookable()
            ->orderBy('name')
            ->paginate(12)
            ->through(fn (Room $room): array => $this->publicRoom($room));

        return Inertia::render('public/rooms/index', [
            'rooms' => $rooms,
        ]);
    }

    /**
     * Display a room with the dates and time slots a customer can book.
     */
    public function show(Request $request, Room $room, BookableSlots $bookableSlots): Response
    {
        $room->load(['schedule', 'user']);

        abort_unless($room->isPubliclyBookable(), 404);

        $dates = $bookableSlots->dates($room);
        $requestedDate = $request->string('date')->toString();
        $selectedDate = in_array($requestedDate, $dates, true) ? $requestedDate : ($dates[0] ?? null);

        return Inertia::render('public/rooms/show', [
            'room' => $this->publicRoom($room),
            'dates' => $dates,
            'selected_date' => $selectedDate,
            'slots' => $selectedDate === null
                ? []
                : $bookableSlots->forDate($room, Carbon::parse($selectedDate)),
        ]);
    }

    /**
     * Get the fields of a room that are safe to show to anyone.
     *
     * @return array<string, mixed>
     */
    private function publicRoom(Room $room): array
    {
        return [
            'uuid' => $room->uuid,
            'name' => $room->name,
            'description' => $room->description,
            'difficulty' => $room->difficulty->value,
            'duration_minutes' => $room->duration_minutes,
            'min_players' => $room->min_players,
            'max_players' => $room->max_players,
            'price_cents' => $room->price_cents,
            'image_url' => $room->image_url,
        ];
    }
}
