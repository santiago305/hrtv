<?php

namespace App\Support\LiveStreams;

use App\Models\LiveStream;
use Illuminate\Support\Facades\Storage;

class LiveStreamPresenter
{
    public static function publicItem(LiveStream $stream): array
    {
        $thumbnailUrl = $stream->thumbnail_url;

        if (filled($thumbnailUrl) && ! str_starts_with($thumbnailUrl, 'http://') && ! str_starts_with($thumbnailUrl, 'https://')) {
            $thumbnailUrl = Storage::disk(config('media.disk', 'public'))->url($thumbnailUrl);
        }

        if (blank($thumbnailUrl) && filled($stream->youtube_video_id)) {
            $thumbnailUrl = "https://img.youtube.com/vi/{$stream->youtube_video_id}/hqdefault.jpg";
        }

        return [
            'id' => (string) $stream->id,
            'title' => $stream->title,
            'slug' => $stream->slug,
            'summary' => $stream->short_description ?? '',
            'description' => $stream->description,
            'status' => $stream->status,
            'isLive' => $stream->status === LiveStream::STATUS_LIVE,
            'youtubeUrl' => $stream->youtube_url,
            'youtubeVideoId' => $stream->youtube_video_id,
            'embedUrl' => $stream->embed_url,
            'thumbnailUrl' => $thumbnailUrl,
            'scheduledAt' => $stream->scheduled_at?->toIso8601String(),
            'startedAt' => $stream->started_at?->toIso8601String(),
            'endedAt' => $stream->ended_at?->toIso8601String(),
        ];
    }
}
