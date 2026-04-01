import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type CarouselNewsProps = {
    images?: string[];
    className?: string;
    autoPlay?: boolean;
    interval?: number;
};

export default function CarouselNews({
    className,
    images = [],
    autoPlay = true,
    interval = 5000,
}: CarouselNewsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (images.length === 0) return;
        if (!autoPlay || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, images.length, interval, isHovered]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (images.length <= 1) return;

            if (event.key === 'ArrowRight') {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }

            if (event.key === 'ArrowLeft') {
                setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images.length]);

    if (images.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const showControls = images.length > 1;

    return (
        <div
            className={clsx(
                'group relative mx-auto aspect-video w-full overflow-hidden border border-border/60 bg-muted/20 shadow-sm',
                className,
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-full w-full">
                {images.map((image, index) => (
                    <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className={clsx(
                            'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out',
                            index === currentIndex ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0',
                        )}
                    />
                ))}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-black/5 to-black/10" />
            </div>

            {showControls ? (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Imagen anterior"
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
                        aria-label="Imagen siguiente"
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
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => goToSlide(index)}
                                aria-label={`Ir a imagen ${index + 1}`}
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