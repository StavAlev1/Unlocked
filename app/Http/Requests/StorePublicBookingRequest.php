<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesBooking;
use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class StorePublicBookingRequest extends FormRequest
{
    use ValidatesBooking;

    /**
     * Get the room being booked, resolved from its public uuid. Rooms that are
     * switched off, or whose owner is not approved, cannot be booked and look
     * missing.
     */
    public function room(): Room
    {
        /** @var Room $room */
        $room = $this->route('room');

        abort_unless($room->isPubliclyBookable(), 404);

        return $room;
    }

    /**
     * Refuse the request outright, before validating, if the room cannot be booked.
     */
    protected function prepareForValidation(): void
    {
        $this->room();
    }
}
