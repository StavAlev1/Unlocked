<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesBooking;
use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    use ValidatesBooking;

    /**
     * The room the booking is being made for, memoized across the request.
     */
    private ?Room $room = null;

    /**
     * Get the room the booking is being made for, scoped to the authenticated owner.
     */
    public function room(): Room
    {
        return $this->room ??= $this->user()->rooms()->whereKey($this->route('room'))->firstOrFail();
    }
}
