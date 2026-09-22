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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->restrictOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->unsignedTinyInteger('party_size');
            $table->string('status')->default('confirmed');
            $table->string('customer_name', 120);
            $table->string('customer_email', 255);
            $table->string('customer_phone', 30)->nullable();
            $table->text('notes')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->string('cancellation_reason', 255)->nullable();
            $table->timestamps();

            // No unique constraint on (schedule_id, starts_at): a cancelled
            // booking must not block re-booking the same slot later.
            // Overlap/double-booking prevention is enforced at the
            // application level (see BookingController::store), scoped to
            // active (non-cancelled) bookings only.
            $table->index(['schedule_id', 'starts_at', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
