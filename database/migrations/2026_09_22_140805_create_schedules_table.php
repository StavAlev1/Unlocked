<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->unique()->constrained()->cascadeOnDelete();
            $table->json('open_days');
            $table->time('open_time');
            $table->time('close_time');
            $table->unsignedSmallInteger('buffer_minutes')->default(15);
            $table->unsignedSmallInteger('advance_booking_days')->default(30);
            $table->unsignedSmallInteger('min_notice_hours')->default(2);
            $table->string('timezone', 64)->default('UTC');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
