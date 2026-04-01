import { Eye } from 'lucide-react';

type NewsMetaProps = {
    authorName?: string | null;
    publishedAt?: string | null;
    viewsCount?: number;
    className?: string;
};

function formatDate(dateStr?: string | null): string {
    if (!dateStr) {
        return 'Sin fecha';
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
        return 'Sin fecha';
    }

    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatCount(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }

    return value.toString();
}

export default function NewsMeta({ authorName, publishedAt, viewsCount = 0, className }: NewsMetaProps) {
    return (
        <div className={['mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground', className].filter(Boolean).join(' ')}>
            <span>Por {authorName && authorName.trim().length > 0 ? authorName : 'Redaccion'}</span>
            <span>{formatDate(publishedAt)}</span>
            <span className="flex items-center gap-1">
                <Eye size={12} /> {formatCount(viewsCount)} vistas
            </span>
        </div>
    );
}
