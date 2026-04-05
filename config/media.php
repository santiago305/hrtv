<?php

return [
    'disk' => env('MEDIA_DISK', 'public'),

    'images' => [
        'directory' => env('MEDIA_IMAGE_DIRECTORY', 'uploads/images'),
    ],

    'news' => [
        'covers_directory' => env('MEDIA_NEWS_COVERS_DIRECTORY', 'uploads/news/covers'),
        'images_directory' => env('MEDIA_NEWS_IMAGES_DIRECTORY', 'uploads/news/images'),
        'videos_directory' => env('MEDIA_NEWS_VIDEOS_DIRECTORY', 'uploads/news/videos'),
        'audio_directory' => env('MEDIA_NEWS_AUDIO_DIRECTORY', 'uploads/news/audio'),
    ],

    'live_streams' => [
        'thumbnails_directory' => env('MEDIA_LIVE_STREAMS_THUMBNAILS_DIRECTORY', 'uploads/live-streams/thumbnails'),
    ],

    'ads' => [
        'creatives_directory' => env('MEDIA_ADS_CREATIVES_DIRECTORY', 'uploads/ads/creatives'),
    ],
];
