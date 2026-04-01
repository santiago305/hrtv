<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('sub_category_id')->constrained('sub_categories')->restrictOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('cover_image', 255)->nullable();
            $table->string('audio_path', 255)->nullable();
            $table->json('images')->nullable();
            $table->json('videos')->nullable();
            $table->string('video_thumbnail', 255)->nullable();
            $table->boolean('is_breaking')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->unsignedBigInteger('likes_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['is_published', 'published_at']);
            $table->index(['category_id', 'sub_category_id']);
            $table->index('is_breaking');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
