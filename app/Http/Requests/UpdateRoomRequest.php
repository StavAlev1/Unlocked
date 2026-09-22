<?php

namespace App\Http\Requests;

use App\Enums\RoomDifficulty;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:2000'],
            'difficulty' => ['required', Rule::enum(RoomDifficulty::class)],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'min_players' => ['required', 'integer', 'min:1'],
            'max_players' => ['required', 'integer', 'min:1', 'gte:min_players'],
            'price_cents' => ['required', 'integer', 'min:0'],
            'is_active' => ['sometimes'],
            'image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
