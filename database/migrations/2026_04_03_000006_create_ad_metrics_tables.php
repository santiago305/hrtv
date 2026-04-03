<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_impressions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creative_id')->constrained('ad_creatives')->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->foreignId('advertiser_id')->constrained('advertisers')->cascadeOnDelete();
            $table->foreignId('ad_slot_id')->constrained('ad_slots')->cascadeOnDelete();
            $table->string('page_type', 50);
            $table->timestamp('shown_at');
            $table->string('session_id', 120)->nullable();
            $table->string('ip_hash', 128)->nullable();
            $table->string('user_agent_hash', 128)->nullable();
            $table->string('referrer_url', 500)->nullable();
            $table->index(['creative_id', 'shown_at']);
            $table->index(['campaign_id', 'shown_at']);
        });

        Schema::create('ad_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creative_id')->constrained('ad_creatives')->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->foreignId('advertiser_id')->constrained('advertisers')->cascadeOnDelete();
            $table->foreignId('ad_slot_id')->constrained('ad_slots')->cascadeOnDelete();
            $table->string('page_type', 50);
            $table->timestamp('clicked_at');
            $table->string('session_id', 120)->nullable();
            $table->string('ip_hash', 128)->nullable();
            $table->string('user_agent_hash', 128)->nullable();
            $table->string('referrer_url', 500)->nullable();
            $table->index(['creative_id', 'clicked_at']);
            $table->index(['campaign_id', 'clicked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_clicks');
        Schema::dropIfExists('ad_impressions');
    }
};
