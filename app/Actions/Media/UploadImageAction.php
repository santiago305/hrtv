<?php

namespace App\Actions\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class UploadImageAction
{
    public function execute(
        UploadedFile $file,
        ?string $directory = null,
        ?string $disk = null
    ): string {
        $diskName = $disk ?? config('media.disk', 'public');
        $targetDirectory = trim($directory ?? config('media.images.directory', 'uploads/images'), '/');
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($name);

        if ($slug === '') {
            $slug = 'image';
        }

        $relativePath = sprintf(
            '%s/%s-%s.webp',
            $targetDirectory,
            $slug,
            Str::lower((string) Str::ulid())
        );

        $stream = fopen($file->getRealPath(), 'rb');

        if ($stream === false) {
            throw new RuntimeException('No se pudo leer el archivo WebP temporal.');
        }

        try {
            Storage::disk($diskName)->put($relativePath, $stream);
        } finally {
            fclose($stream);
        }

        return $relativePath;
    }
}
