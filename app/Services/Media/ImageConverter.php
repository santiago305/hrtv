<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ImageConverter
{
    public function convertToWebp(
        UploadedFile $file,
        ?string $directory = null,
        ?int $quality = null,
        ?string $disk = null
    ): string {
        if (! function_exists('imagewebp')) {
            throw new RuntimeException('La extension GD con soporte WebP no esta disponible en PHP.');
        }

        $diskName = $disk ?? config('media.disk', 'public');
        $targetDirectory = trim($directory ?? config('media.images.directory', 'uploads/images'), '/');
        $targetQuality = $quality ?? (int) config('media.images.quality', 80);
        $extension = strtolower($file->getClientOriginalExtension());
        $sourcePath = $file->getRealPath();

        if (! $sourcePath) {
            throw new RuntimeException('No se pudo leer el archivo temporal de imagen.');
        }

        if ($extension === 'webp') {
            return $this->storeWebpWithoutConversion($file, $targetDirectory, $diskName);
        }

        $image = match ($extension) {
            'jpg', 'jpeg' => @imagecreatefromjpeg($sourcePath),
            'png' => @imagecreatefrompng($sourcePath),
            default => throw new RuntimeException("Formato de imagen no soportado: {$extension}."),
        };

        if (! $image) {
            throw new RuntimeException('No se pudo abrir la imagen para convertirla a WebP.');
        }

        if ($extension === 'png') {
            imagepalettetotruecolor($image);
            imagealphablending($image, true);
            imagesavealpha($image, true);
        }

        $relativePath = $this->buildRelativePath($file, $targetDirectory);
        $absolutePath = Storage::disk($diskName)->path($relativePath);
        $directoryPath = dirname($absolutePath);

        if (! is_dir($directoryPath) && ! mkdir($directoryPath, 0775, true) && ! is_dir($directoryPath)) {
            imagedestroy($image);
            throw new RuntimeException('No se pudo crear el directorio destino para la imagen.');
        }

        if (! imagewebp($image, $absolutePath, $targetQuality)) {
            imagedestroy($image);
            throw new RuntimeException('No se pudo convertir la imagen a WebP.');
        }

        imagedestroy($image);

        return $relativePath;
    }

    private function buildRelativePath(UploadedFile $file, string $directory): string
    {
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($name);

        if ($slug === '') {
            $slug = 'image';
        }

        return sprintf(
            '%s/%s-%s.webp',
            $directory,
            $slug,
            Str::lower((string) Str::ulid())
        );
    }

    private function storeWebpWithoutConversion(UploadedFile $file, string $directory, string $disk): string
    {
        $relativePath = $this->buildRelativePath($file, $directory);
        $stream = fopen($file->getRealPath(), 'rb');

        if ($stream === false) {
            throw new RuntimeException('No se pudo leer el archivo WebP temporal.');
        }

        try {
            Storage::disk($disk)->put($relativePath, $stream);
        } finally {
            fclose($stream);
        }

        return $relativePath;
    }
}
