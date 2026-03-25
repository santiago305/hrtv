/*  */import { Link } from '@inertiajs/react';
import { Eye, Heart } from 'lucide-react';
import { NewsArticle } from '@/types/news';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function NewsCard({ article, variant = 'default', className = '' }: NewsCardProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  if (variant === 'compact') {
    return (
      <Link
        href={route('news.show', { slug: article.slug })}
        className={`group flex gap-3 border-b border-border py-3 transition-colors last:border-0 hover:bg-surface ${className}`}
      >
        <img
          src={article.image}
          alt={article.title}
          className="h-16 w-24 flex-shrink-0 object-cover"
          loading="lazy"
        />
        <div className="flex flex-col justify-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {article.category.name}
          </span>
          <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h4>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={route('news.show', { slug: article.slug })}
        className={`group relative block overflow-hidden ${className}`}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-alt/90 via-surface-alt/30 to-transparent" />
          {article.isBreaking && (
            <div className="absolute left-0 top-4 flex items-center gap-1.5 bg-accent px-3 py-1">
              <span className="inline-block h-1.5 w-1.5 animate-pulse-live rounded-full bg-accent-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                Urgente
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              {article.category.name}
            </span>
            <h2 className="mt-1 text-lg font-bold leading-tight text-primary-foreground sm:text-xl">
              {article.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-primary-foreground/70">
              {article.summary}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={route('news.show', { slug: article.slug })}
      className={`group relative block overflow-hidden border border-border bg-background transition-shadow hover:shadow-md ${className}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {article.isBreaking && (
          <div className="absolute left-0 top-3 flex items-center gap-1 bg-accent px-2 py-0.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-live rounded-full bg-accent-foreground" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-accent-foreground">
              Urgente
            </span>
          </div>
        )}
      </div>
      <div className="h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
      <div className="p-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          {article.category.name}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-foreground">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{formatDate(article.publishedAt)}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye size={12} /> {formatCount(article.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={12} /> {formatCount(article.likes)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
