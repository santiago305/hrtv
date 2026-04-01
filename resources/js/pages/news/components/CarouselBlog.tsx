import clsx from 'clsx';
import { useEffect, useState } from 'react';

type CarouselBlogProps = {
    images?: string[];
    className?: string;
};

export default function CarouselBlog({ className, images = [] }: CarouselBlogProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className={clsx('relative mx-auto aspect-video w-full max-w-[700px] select-none overflow-hidden rounded-lg shadow-lg', className)}>
            <img src={images[currentIndex]} alt={`Imagen ${currentIndex + 1}`} className="h-full w-full object-cover transition-opacity duration-500" />

            <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all duration-200 hover:bg-black/80"
            >
                {'<'}
            </button>

            <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all duration-200 hover:bg-black/80"
            >
                {'>'}
            </button>
        </div>
    );
}
