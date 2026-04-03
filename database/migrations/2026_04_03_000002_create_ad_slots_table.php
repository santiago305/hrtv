<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_slots', function (Blueprint $table) {
            $table->id();
            $table->string('code', 80)->unique();
            $table->string('name', 120);
            $table->string('page_type', 50);
            $table->string('size', 30);
            $table->unsignedInteger('banner_width');
            $table->unsignedInteger('banner_height');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['page_type', 'size']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_slots');
    }
};
