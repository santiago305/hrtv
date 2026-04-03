<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_creatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->foreignId('ad_slot_id')->constrained('ad_slots')->cascadeOnDelete();
            $table->string('title', 150)->nullable();
            $table->string('file_path');
            $table->string('target_url', 500)->nullable();
            $table->unsignedInteger('width');
            $table->unsignedInteger('height');
            $table->string('mime_type', 50)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('alt_text', 255)->nullable();
            $table->unsignedInteger('display_weight')->default(1);
            $table->unsignedBigInteger('impressions_count')->default(0);
            $table->unsignedBigInteger('clicks_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['campaign_id', 'ad_slot_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_creatives');
    }
};
