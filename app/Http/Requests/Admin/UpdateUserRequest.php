<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($this->targetUser()->id),
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
            'is_admin' => ['sometimes'],
        ];
    }

    /**
     * Get the user being updated, as resolved by route model binding.
     */
    private function targetUser(): User
    {
        $user = $this->route('user');

        if (! $user instanceof User) {
            abort(404);
        }

        return $user;
    }
}
