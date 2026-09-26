<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds the moment an administrator approved an owner. Rooms only appear on
     * the public site once their owner is approved. Everyone who already exists
     * is approved now, so introducing the gate does not hide any live rooms.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->timestamp('approved_at')->nullable()->after('email_verified_at');
        });

        DB::table('users')->update(['approved_at' => now()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('approved_at');
        });
    }
};
