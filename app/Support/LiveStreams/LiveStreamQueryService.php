<?php

namespace App\Support\LiveStreams;

use App\Models\LiveStream;

class LiveStreamQueryService
{
    public function current(): ?LiveStream
    {
        $live = LiveStream::query()
            ->where('status', LiveStream::STATUS_LIVE)
            ->where('is_active', true)
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->first();

        if ($live !== null) {
            return $live;
        }

        return LiveStream::query()
            ->where('status', LiveStream::STATUS_ENDED)
            ->where('is_active', true)
            ->orderByDesc('ended_at')
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->first();
    }

    public function previous(?int $excludeId = null, int $limit = 10)
    {
        return LiveStream::query()
            ->where('status', LiveStream::STATUS_ENDED)
            ->where('is_active', true)
            ->when($excludeId !== null, fn ($query) => $query->whereKeyNot($excludeId))
            ->orderByDesc('ended_at')
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }
}
