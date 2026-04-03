import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { SharedData } from '@/types';
import { AdPlaceholder } from '@/components/AdPlaceholder';

type SupportedAdSize = 'banner' | 'leaderboard' | 'rectangle';

type PublicAdSlotProps = {
    slotCode: string;
    size: SupportedAdSize;
    className?: string;
};

type AdResponse = {
    slot: string;
    data: null | {
        id: number;
        title: string | null;
        image_url: string;
        target_url: string | null;
        alt_text: string | null;
        size: string;
        width: number;
        height: number;
        click_url: string;
    };
};

export function PublicAdSlot({ slotCode, size, className = '' }: PublicAdSlotProps) {
    const { app } = usePage<SharedData>().props;
    const debug = Boolean(app?.debug);
    const [loading, setLoading] = useState(true);
    const [ad, setAd] = useState<AdResponse['data']>(null);

    useEffect(() => {
        let active = true;

        const loadAd = async () => {
            try {
                const response = await fetch(`/ads/slots/${slotCode}`, {
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ad slot request failed: ${response.status}`);
                }

                const payload: AdResponse = await response.json();

                if (active) {
                    setAd(payload.data);
                }
            } catch {
                if (active) {
                    setAd(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadAd();

        return () => {
            active = false;
        };
    }, [slotCode]);

    if (ad) {
        return (
            <a href={ad.click_url} target="_blank" rel="noreferrer sponsored" className={`block overflow-hidden ${className}`}>
                <img
                    src={ad.image_url}
                    alt={ad.alt_text ?? ad.title ?? 'Publicidad'}
                    className="h-full w-full object-cover"
                />
            </a>
        );
    }

    if (loading || !debug) {
        return null;
    }

    return <AdPlaceholder size={size} className={className} />;
}
