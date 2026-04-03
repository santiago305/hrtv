<?php

namespace App\Enums;

enum AdSize: string
{
    case Banner = 'banner';
    case Square = 'square';
    case Leaderboard = 'leaderboard';
    case Skyscraper = 'skyscraper';
    case Rectangle = 'rectangle';

    public function dimensions(): array
    {
        return match ($this) {
            self::Banner => ['width' => 728, 'height' => 90],
            self::Square => ['width' => 300, 'height' => 250],
            self::Leaderboard => ['width' => 970, 'height' => 90],
            self::Skyscraper => ['width' => 160, 'height' => 600],
            self::Rectangle => ['width' => 336, 'height' => 280],
        };
    }

    public static function values(): array
    {
        return array_map(static fn (self $size) => $size->value, self::cases());
    }
}
