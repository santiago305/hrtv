<?php

namespace App\Support;

class YoutubeUrl
{
    public static function extractVideoId(?string $youtubeUrl = null, ?string $youtubeVideoId = null, ?string $iframeHtml = null): ?string
    {
        $iframeHtml = filled($iframeHtml) ? trim($iframeHtml) : null;
        $youtubeUrl = filled($youtubeUrl) ? trim($youtubeUrl) : null;
        $youtubeVideoId = filled($youtubeVideoId) ? trim($youtubeVideoId) : null;

        if ($iframeHtml !== null && preg_match('/src=["\']([^"\']+)["\']/i', $iframeHtml, $matches) === 1) {
            $youtubeUrl = $matches[1];
        }

        $candidate = $youtubeVideoId ?? $youtubeUrl ?? '';

        if ($candidate === '') {
            return null;
        }

        if (preg_match('/^[A-Za-z0-9_-]{6,20}$/', $candidate) === 1) {
            return $candidate;
        }

        $patterns = [
            '/youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,20})/i',
            '/youtu\.be\/([A-Za-z0-9_-]{6,20})/i',
            '/youtube\.com\/embed\/([A-Za-z0-9_-]{6,20})/i',
            '/youtube\.com\/live\/([A-Za-z0-9_-]{6,20})/i',
            '/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,20})/i',
            '/[?&]v=([A-Za-z0-9_-]{6,20})/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $candidate, $matches) === 1) {
                return $matches[1];
            }
        }

        return null;
    }
}
