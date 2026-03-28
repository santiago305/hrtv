<?php

return [
    'disk' => env('MEDIA_DISK', 'public'),

    'images' => [
        'directory' => env('MEDIA_IMAGE_DIRECTORY', 'uploads/images'),
        'quality' => (int) env('MEDIA_IMAGE_WEBP_QUALITY', 80),
        'keep_original' => (bool) env('MEDIA_IMAGE_KEEP_ORIGINAL', false),
    ],
];
