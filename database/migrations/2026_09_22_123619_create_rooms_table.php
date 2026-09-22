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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 120);
            $table->string('slug', 160);
            $table->text('description');
            $table->string('difficulty')->default('easy');
            $table->unsignedSmallInteger('duration_minutes');
            $table->unsignedTinyInteger('min_players')->default(1);
            $table->unsignedTinyInteger('max_players');
            $table->unsignedInteger('price_cents');
            $table->string('image_path', 255)->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
