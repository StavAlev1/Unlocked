<?php

namespace App\Http\Requests;

use App\Models\Room;
use App\Models\Schedule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    /**
     * The room the booking is being made for, memoized across the request.
     */
    private ?Room $room = null;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'starts_at' => ['required', 'date'],
            'party_size' => ['required', 'integer', 'min:1'],
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:30'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Configure the validator instance with the schedule- and room-aware checks
     * that cannot be expressed as simple rules.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $room = $this->room();
            $schedule = $room->schedule;

            if ($schedule === null) {
                $validator->errors()->add('starts_at', __('This room does not have a schedule configured.'));

                return;
            }

            if (! $validator->errors()->has('party_size')) {
                $this->validatePartySize($validator, $room);
            }

            if (! $validator->errors()->has('starts_at')) {
                $this->validateStartsAtWindow($validator, $schedule, $room);
            }
        });
    }

    /**
     * Get the room the booking is being made for, scoped to the authenticated owner.
     */
    public function room(): Room
    {
        return $this->room ??= $this->user()->rooms()->findOrFail($this->route('room'));
    }

    /**
     * Validate that the requested party size fits within the room's player range.
     */
    private function validatePartySize(Validator $validator, Room $room): void
    {
        $partySize = $this->integer('party_size');

        if ($partySize < $room->min_players || $partySize > $room->max_players) {
            $validator->errors()->add('party_size', __('Party size must be between :min and :max players for this room.', [
                'min' => $room->min_players,
                'max' => $room->max_players,
            ]));
        }
    }

    /**
     * Validate that the requested start time falls within the schedule's
     * booking window: notice period, advance limit, open days, and open hours.
     */
    private function validateStartsAtWindow(Validator $validator, Schedule $schedule, Room $room): void
    {
        $startsAt = Carbon::parse($this->string('starts_at')->toString());
        $now = Carbon::now();

        if ($startsAt->lessThan($now->clone()->addHours($schedule->min_notice_hours))) {
            $validator->errors()->add('starts_at', __('This time does not meet the minimum notice period.'));

            return;
        }

        if ($startsAt->greaterThan($now->clone()->addDays($schedule->advance_booking_days))) {
            $validator->errors()->add('starts_at', __('This time is too far in advance to book.'));

            return;
        }

        $openDays = array_map('intval', $schedule->open_days);

        if (! in_array($startsAt->dayOfWeek, $openDays, true)) {
            $validator->errors()->add('starts_at', __('The room is not open on this day of the week.'));

            return;
        }

        $openTime = Carbon::parse($startsAt->toDateString().' '.$schedule->open_time);
        $closeTime = Carbon::parse($startsAt->toDateString().' '.$schedule->close_time);
        $latestStart = $closeTime->clone()->subMinutes($room->duration_minutes);

        if ($startsAt->lessThan($openTime) || $startsAt->greaterThan($latestStart)) {
            $validator->errors()->add('starts_at', __("This time is outside the room's open hours."));
        }
    }
}
