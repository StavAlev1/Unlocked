<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

/**
 * Gives a model a random, non-guessable `uuid` column for use in public URLs,
 * while keeping the auto-incrementing `id` as the primary key.
 */
trait HasPublicUuid
{
    use HasUuids;

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Generate a fully random (version 4) UUID, so public URLs reveal nothing
     * about when the record was created.
     */
    public function newUniqueId(): string
    {
        return (string) Str::uuid();
    }
}
