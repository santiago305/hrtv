import { createPlayer } from '@videojs/react';
import { Video, videoFeatures, VideoSkin } from '@videojs/react/video';
import '@videojs/react/video/skin.css';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const showControls = videos.length > 1;

    return (
        <div
            className={clsx(
                'news-video-player group relative mx-auto aspect-video w-full overflow-hidden mt-5',
                className,
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-full w-full">
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

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-black/5 to-black/10" />
            </div>

            {showControls ? (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Video anterior"
                        className={clsx(
                            'absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full',
                            'border border-white/15 bg-black/45 text-white backdrop-blur-md',
                            'transition-all duration-200 hover:scale-105 hover:bg-black/65',
                            'opacity-0 shadow-lg group-hover:opacity-100',
                            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Video siguiente"
                        className={clsx(
                            'absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full',
                            'border border-white/15 bg-black/45 text-white backdrop-blur-md',
                            'transition-all duration-200 hover:scale-105 hover:bg-black/65',
                            'opacity-0 shadow-lg group-hover:opacity-100',
                            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                        )}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">
                        {videos.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => goToSlide(index)}
                                aria-label={`Ir a video ${index + 1}`}
                                className={clsx(
                                    'h-2.5 rounded-full transition-all duration-300',
                                    index === currentIndex
                                        ? 'w-6 bg-white'
                                        : 'w-2.5 bg-white/45 hover:bg-white/75',
                                )}
                            />
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
}
