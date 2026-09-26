<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * @var array<int, string>
     */
    private array $tables = ['rooms', 'bookings'];

    /**
     * Run the migrations.
     *
     * Adds a public, non-guessable identifier to rooms and bookings so they can
     * be exposed in public URLs without leaking sequential ids. Existing rows
     * are backfilled before the column becomes required and unique.
     */
    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->uuid('uuid')->nullable()->after('id');
            });

            DB::table($tableName)->whereNull('uuid')->orderBy('id')->each(
                fn (object $row) => DB::table($tableName)
                    ->where('id', $row->id)
                    ->update(['uuid' => (string) Str::uuid()])
            );

            Schema::table($tableName, function (Blueprint $table): void {
                $table->uuid('uuid')->nullable(false)->change();
            });

            Schema::table($tableName, function (Blueprint $table): void {
                $table->unique('uuid');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->dropUnique(['uuid']);
            });

            Schema::table($tableName, function (Blueprint $table): void {
                $table->dropColumn('uuid');
            });
        }
    }
};
