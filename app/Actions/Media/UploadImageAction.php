<?php

namespace App\Actions\Media;

use App\Services\Media\ImageConverter;
use Illuminate\Http\UploadedFile;

class UploadImageAction
{
    public function __construct(
        private readonly ImageConverter $imageConverter
    ) {
    }

    public function execute(
        UploadedFile $file,
        ?string $directory = null,
        ?int $quality = null,
        ?string $disk = null
    ): string {
        return $this->imageConverter->convertToWebp($file, $directory, $quality, $disk);
    }
}
