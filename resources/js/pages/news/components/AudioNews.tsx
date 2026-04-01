import { Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type AudioNewsProps = {
    src?: string | null;
    label?: string;
    className?: string;
};

function formatTime(timeInSeconds: number): string {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
        return '0:00';
    }

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${seconds}`;
}

export default function AudioNews({ src, label = 'Audio exclusivo', className }: AudioNewsProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime || 0);
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [src]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    }, [src]);

    const progressWidth = useMemo(() => {
        if (duration <= 0) {
            return '0%';
        }

        return `${Math.min((currentTime / duration) * 100, 100)}%`;
    }, [currentTime, duration]);

    if (!src) {
        return null;
    }

    const togglePlayback = async () => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (audio.paused) {
            await audio.play();
            return;
        }

        audio.pause();
    };

    return (
        <div className={['float-none mb-4 sm:float-left sm:mb-2 sm:mr-5 sm:w-64', className].filter(Boolean).join(' ')}>
            <div className="flex items-center gap-3 border border-border bg-surface p-3">
                <audio ref={audioRef} src={src} preload="metadata" />

                <button
                    type="button"
                    title={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                    aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                    onClick={() => {
                        void togglePlayback();
                    }}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                </button>

                <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                    <div className="mt-1 h-1 w-full bg-border">
                        <div className="h-full bg-primary transition-all" style={{ width: progressWidth }} />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </p>
                </div>
            </div>
        </div>
    );
}
