import clsx from 'clsx';

type VideoBlogProps = {
    className?: string;
    video?: string[];
};

export default function VideoBlog({ className, video = [] }: VideoBlogProps) {
    if (video.length === 0) return null;

    return (
        <div className={clsx('relative mx-auto aspect-video w-full max-w-[700px] overflow-hidden rounded-lg shadow-lg', className)}>
            <video controls autoPlay muted loop className="h-full w-full object-cover">
                <source src={video[0]} type="video/mp4" />
                Tu navegador no soporta la etiqueta de video.
            </video>
        </div>
    );
}
