<?php

namespace App\Enums;

enum CampaignStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Paused = 'paused';
    case Finished = 'finished';

    public static function values(): array
    {
        return array_map(static fn (self $status) => $status->value, self::cases());
    }
}
