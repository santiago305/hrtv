<?php

namespace App\Enums;

enum AdPageType: string
{
    case Home = 'home';
    case Radio = 'radio';
    case About = 'about';
    case Contact = 'contact';
    case NewsList = 'news_list';
    case NewsDetail = 'news_detail';

    public static function values(): array
    {
        return array_map(static fn (self $pageType) => $pageType->value, self::cases());
    }
}
