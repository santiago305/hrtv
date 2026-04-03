import { useEffect, useState } from 'react';

type InteractionType = 'view' | 'like';

type Counters = {
    views: number;
    likes: number;
};

type UseNewsEngagementParams = {
    newsId: string;
    newsSlug: string;
    initialViews: number;
    initialLikes: number;
};

type InteractionResponse = {
    counted: boolean;
    views: number;
    likes: number;
};

const STORAGE_KEY = 'news-engagement';

function readStorage(): Record<string, Partial<Record<InteractionType, boolean>>> {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (! raw) {
            return {};
        }

        const parsed = JSON.parse(raw);

        return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, Partial<Record<InteractionType, boolean>>> : {};
    } catch {
        return {};
    }
}

function writeStorage(value: Record<string, Partial<Record<InteractionType, boolean>>>) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
        // Evita romper la app si localStorage falla.
    }
}

function hasInteraction(newsId: string, type: InteractionType): boolean {
    const storage = readStorage();

    return storage[newsId]?.[type] === true;
}

function markInteraction(newsId: string, type: InteractionType) {
    const storage = readStorage();

    writeStorage({
        ...storage,
        [newsId]: {
            ...storage[newsId],
            [type]: true,
        },
    });
}

function getCsrfToken() {
    if (typeof document === 'undefined') {
        return '';
    }

    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

async function sendInteraction(url: string): Promise<InteractionResponse> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({}),
    });

    if (! response.ok) {
        throw new Error(`Failed with status ${response.status}`);
    }

    return response.json() as Promise<InteractionResponse>;
}

export function useNewsEngagement({
    newsId,
    newsSlug,
    initialViews,
    initialLikes,
}: UseNewsEngagementParams) {
    const [counters, setCounters] = useState<Counters>({
        views: initialViews,
        likes: initialLikes,
    });
    const [hasViewed, setHasViewed] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeSubmitting, setLikeSubmitting] = useState(false);

    useEffect(() => {
        setCounters({
            views: initialViews,
            likes: initialLikes,
        });

        const viewed = hasInteraction(newsId, 'view');
        const liked = hasInteraction(newsId, 'like');

        setHasViewed(viewed);
        setHasLiked(liked);

        if (viewed) {
            return;
        }

        void sendInteraction(route('news.views.store', { news: newsSlug }))
            .then((result) => {
                setCounters({
                    views: result.views,
                    likes: result.likes,
                });

                if (result.counted) {
                    markInteraction(newsId, 'view');
                    setHasViewed(true);
                }
            })
            .catch(() => {
                // No interrumpe la lectura si el registro de la vista falla.
            });
    }, [initialLikes, initialViews, newsId, newsSlug]);

    const like = async () => {
        if (hasLiked || likeSubmitting) {
            return;
        }

        setLikeSubmitting(true);

        try {
            const result = await sendInteraction(route('news.likes.store', { news: newsSlug }));

            setCounters({
                views: result.views,
                likes: result.likes,
            });

            if (result.counted) {
                markInteraction(newsId, 'like');
            }

            setHasLiked(true);
        } finally {
            setLikeSubmitting(false);
        }
    };

    return {
        views: counters.views,
        likes: counters.likes,
        hasViewed,
        hasLiked,
        likeSubmitting,
        like,
    };
}
