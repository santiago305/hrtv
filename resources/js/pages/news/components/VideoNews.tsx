import { createPlayer } from '@videojs/react';
import { Video, videoFeatures, VideoSkin } from '@videojs/react/video';
import '@videojs/react/video/skin.css';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

const Player = createPlayer({ features: videoFeatures });

type VideoNewsProps = {
    className?: string;
    video?: string[];
};

export default function VideoNews({ className, video = [] }: VideoNewsProps) {
    const videos = useMemo(() => video.filter((item) => item.trim().length > 0), [video]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
    }, [videos.length]);

    useEffect(() => {
        if (videos.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            if (isHovered) {
                return;
            }

            setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [isHovered, videos.length]);

    if (videos.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    };

    return (
        <div
            className={clsx(
                'news-video-player relative mx-auto aspect-video w-full max-w-175 overflow-hidden',
                className,
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Player.Provider>
                <VideoSkin>
                    <Video
                        key={videos[currentIndex]}
                        src={videos[currentIndex]}
                        playsInline
                        autoPlay
                        muted
                        onEnded={() => {
                            if (videos.length > 1) {
                                setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
                            }
                        }}
                    />
                </VideoSkin>
            </Player.Provider>

            {videos.length > 1 ? (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all duration-200 hover:bg-black/80"
                    >
                        {'<'}
                    </button>

                    <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all duration-200 hover:bg-black/80"
                    >
                        {'>'}
                    </button>

                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/45 px-3 py-1">
                        {videos.map((item, index) => (
                            <button
                                key={`${item}-${index}`}
                                type="button"
                                onClick={() => setCurrentIndex(index)}
                                className={[
                                    'h-2 w-2 rounded-full transition-all',
                                    index === currentIndex ? 'bg-white' : 'bg-white/45 hover:bg-white/70',
                                ].join(' ')}
                                aria-label={`Ir al video ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
}
