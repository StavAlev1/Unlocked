<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateScheduleRequest;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomScheduleController extends Controller
{
    /**
     * Show the form for editing the room's schedule.
     */
    public function edit(Request $request, int $room): Response
    {
        $room = $request->user()->rooms()->findOrFail($room);

        $schedule = $room->schedule()->firstOrCreate([], Schedule::defaultAttributes());

        $this->authorize('update', $schedule);

        return Inertia::render('rooms/schedule/edit', [
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'slug' => $room->slug,
            ],
            'schedule' => [
                'id' => $schedule->id,
                'open_days' => $schedule->open_days,
                'open_time' => $schedule->open_time,
                'close_time' => $schedule->close_time,
                'buffer_minutes' => $schedule->buffer_minutes,
                'advance_booking_days' => $schedule->advance_booking_days,
                'min_notice_hours' => $schedule->min_notice_hours,
                'timezone' => $schedule->timezone,
                'is_active' => $schedule->is_active,
            ],
        ]);
    }

    /**
     * Update the room's schedule in storage.
     */
    public function update(UpdateScheduleRequest $request, int $room): RedirectResponse
    {
        $room = $request->user()->rooms()->findOrFail($room);

        $schedule = $room->schedule()->firstOrCreate([], Schedule::defaultAttributes());

        $this->authorize('update', $schedule);

        $schedule->fill([
            ...$request->safe()->only([
                'open_time', 'close_time', 'buffer_minutes',
                'advance_booking_days', 'min_notice_hours', 'timezone',
            ]),
            // Form fields always arrive as strings; normalize to integers so
            // they compare correctly (e.g. strict in_array checks against
            // Carbon::dayOfWeek) wherever open_days is read later.
            'open_days' => array_map('intval', $request->validated('open_days')),
            'is_active' => $request->boolean('is_active'),
        ]);

        $schedule->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Schedule updated.')]);

        return to_route('rooms.schedule.edit', $room);
    }
}
