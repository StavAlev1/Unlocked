<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $rooms = $request->user()->rooms()
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('rooms/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request): RedirectResponse
    {
        $room = $request->user()->rooms()->create([
            ...$request->safe()->only([
                'name', 'description', 'difficulty', 'duration_minutes',
                'min_players', 'max_players', 'price_cents',
            ]),
            'slug' => $this->uniqueSlug($request->user()->id, $request->string('name')->toString()),
            'is_active' => $request->boolean('is_active'),
        ]);

        if ($request->hasFile('image')) {
            $room->update([
                'image_path' => $request->file('image')->store('rooms', 'public'),
            ]);
        }

        $room->schedule()->create(Schedule::defaultAttributes());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Room created.')]);

        return to_route('rooms.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, int $room): Response
    {
        $room = $request->user()->rooms()->findOrFail($room);

        return Inertia::render('rooms/edit', [
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'slug' => $room->slug,
                'description' => $room->description,
                'difficulty' => $room->difficulty->value,
                'duration_minutes' => $room->duration_minutes,
                'min_players' => $room->min_players,
                'max_players' => $room->max_players,
                'price_cents' => $room->price_cents,
                'image_path' => $room->image_path,
                'image_url' => $room->image_url,
                'is_active' => $room->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, int $room): RedirectResponse
    {
        $room = $request->user()->rooms()->findOrFail($room);

        $this->authorize('update', $room);

        $name = $request->string('name')->toString();

        $room->fill([
            ...$request->safe()->only([
                'name', 'description', 'difficulty', 'duration_minutes',
                'min_players', 'max_players', 'price_cents',
            ]),
            'is_active' => $request->boolean('is_active'),
        ]);

        if ($room->isDirty('name')) {
            $room->slug = $this->uniqueSlug($request->user()->id, $name, $room->id);
        }

        if ($request->hasFile('image')) {
            if ($room->image_path !== null) {
                Storage::disk('public')->delete($room->image_path);
            }

            $room->image_path = $request->file('image')->store('rooms', 'public');
        }

        $room->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Room updated.')]);

        return to_route('rooms.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $room): RedirectResponse
    {
        $room = $request->user()->rooms()->findOrFail($room);

        $this->authorize('delete', $room);

        $hasUpcomingBookings = $room->schedule !== null && $room->schedule->bookings()
            ->where('status', BookingStatus::Confirmed)
            ->where('starts_at', '>=', now())
            ->exists();

        if ($hasUpcomingBookings) {
            throw ValidationException::withMessages([
                'room' => __('This room has upcoming bookings and cannot be deleted.'),
            ]);
        }

        if ($room->image_path !== null) {
            Storage::disk('public')->delete($room->image_path);
        }

        DB::transaction(function () use ($room): void {
            // Only past/cancelled bookings can remain at this point (upcoming
            // confirmed ones were already blocked above). bookings.schedule_id
            // is restrictOnDelete as a safety net against silently destroying
            // real booking history, so they must be cleared explicitly here.
            $room->schedule?->bookings()->delete();
            $room->schedule()->delete();
            $room->delete();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Room deleted.')]);

        return to_route('rooms.index');
    }

    /**
     * Generate a slug from the given name that is unique among the user's rooms.
     */
    private function uniqueSlug(int $userId, string $name, ?int $ignoreRoomId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;

        while (
            Room::query()
                ->where('user_id', $userId)
                ->where('slug', $slug)
                ->when($ignoreRoomId !== null, fn ($query) => $query->whereKeyNot($ignoreRoomId))
                ->exists()
        ) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
