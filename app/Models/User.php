<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property bool $is_admin
 * @property Carbon|null $email_verified_at
 * @property Carbon|null $approved_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'is_admin'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the rooms owned by the user.
     *
     * @return HasMany<Room, $this>
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    /**
     * Determine whether the user's rooms may appear on the public site.
     * Administrators are always approved; everyone else needs an administrator
     * to approve them first.
     */
    public function isApproved(): bool
    {
        return $this->is_admin || $this->approved_at !== null;
    }

    /**
     * Approve the user so their rooms can appear on the public site.
     */
    public function approve(): void
    {
        $this->forceFill(['approved_at' => now()])->save();
    }

    /**
     * Withdraw the user's approval, hiding their rooms from the public site.
     */
    public function revokeApproval(): void
    {
        $this->forceFill(['approved_at' => null])->save();
    }

    /**
     * Scope a query to only include approved users, matching isApproved().
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where(
            fn (Builder $query) => $query->where('is_admin', true)->orWhereNotNull('approved_at')
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'approved_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }
}
