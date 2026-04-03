export const AD_SIZES = [
    { value: 'banner', label: 'Banner', width: 728, height: 90 },
    { value: 'square', label: 'Square', width: 300, height: 250 },
    { value: 'leaderboard', label: 'Leaderboard', width: 970, height: 90 },
    { value: 'skyscraper', label: 'Skyscraper', width: 160, height: 600 },
    { value: 'rectangle', label: 'Rectangle', width: 336, height: 280 },
] as const;

export const PAGE_TYPES = [
    { value: 'home', label: 'Inicio' },
    { value: 'radio', label: 'Radio' },
    { value: 'about', label: 'Conocenos' },
    { value: 'contact', label: 'Contacto' },
    { value: 'news_list', label: 'Listado de noticias' },
    { value: 'news_detail', label: 'Detalle de noticia' },
];

export const CAMPAIGN_STATUSES = [
    { value: 'draft', label: 'Borrador' },
    { value: 'active', label: 'Activa' },
    { value: 'paused', label: 'Pausada' },
    { value: 'finished', label: 'Finalizada' },
];
