<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('news') || ! Schema::hasColumn('news', 'video_thumbnail')) {
            return;
        }

        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn('video_thumbnail');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('news') || Schema::hasColumn('news', 'video_thumbnail')) {
            return;
        }

        Schema::table('news', function (Blueprint $table) {
            $table->string('video_thumbnail', 255)->nullable()->after('videos');
        });
    }
};
