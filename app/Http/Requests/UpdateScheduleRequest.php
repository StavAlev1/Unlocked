<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateScheduleRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'open_days' => ['required', 'array', 'min:1'],
            'open_days.*' => ['integer', 'between:0,6', 'distinct'],
            'open_time' => ['required', 'date_format:H:i'],
            'close_time' => ['required', 'date_format:H:i', 'after:open_time'],
            'buffer_minutes' => ['required', 'integer', 'between:0,120'],
            'advance_booking_days' => ['required', 'integer', 'between:1,365'],
            'min_notice_hours' => ['required', 'integer', 'between:0,168'],
            'timezone' => ['required', 'string', 'max:64'],
            'is_active' => ['sometimes'],
        ];
    }
}
