<?php

namespace App\Actions\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class UploadMediaAction
{
    public function execute(
        UploadedFile $file,
        string $directory,
        ?string $disk = null
    ): string {
        $diskName = $disk ?? config('media.disk', 'public');
        $targetDirectory = trim($directory, '/');
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($name);
        $extension = strtolower($file->getClientOriginalExtension());

        if ($slug === '') {
            $slug = 'media';
        }

        if ($extension === '') {
            $extension = $file->guessExtension() ?: 'bin';
        }

        $relativePath = sprintf(
            '%s/%s-%s.%s',
            $targetDirectory,
            $slug,
            Str::lower((string) Str::ulid()),
            $extension
        );

        $stream = fopen($file->getRealPath(), 'rb');

        if ($stream === false) {
            throw new RuntimeException('No se pudo leer el archivo temporal.');
        }

        try {
            Storage::disk($diskName)->put($relativePath, $stream);
        } finally {
            fclose($stream);
        }

        return $relativePath;
    }
}
