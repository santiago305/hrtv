import { useState } from 'react';
import { Eye, Heart, Pause, Play, Share2 } from 'lucide-react';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { NewsCard } from '@/components/NewsCard';
import { mockArticles } from '@/data/mockData';
import PublicSiteLayout from '@/layouts/public-site-layout';

interface NewsDetailPageProps {
  slug: string;
}

export default function NewsDetailPage({ slug }: NewsDetailPageProps) {
  const [liked, setLiked] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const article = mockArticles.find((a) => a.slug === slug) || mockArticles[0];
  const relatedArticles = mockArticles
    .filter((a) => a.id !== article.id && a.category.id === article.category.id)
    .slice(0, 5);
  const moreRelated = mockArticles.filter((a) => a.id !== article.id).slice(0, 5);
  const sidebarArticles = relatedArticles.length > 0 ? relatedArticles : moreRelated;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return (
    <PublicSiteLayout title={article.title}>
      <article className="container-main py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <span className="bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                {article.category.name}
              </span>
              {article.subcategory && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {article.subcategory.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {article.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>Por {article.author}</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {formatCount(article.views)} vistas
              </span>
            </div>

            <div className="mt-5 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="aspect-video w-full object-cover"
              />
            </div>

            <p className="mt-5 border-l-2 border-primary pl-4 text-base leading-relaxed text-foreground/70">
              {article.summary}
            </p>

            <div className="mt-6">
              <div className="float-none mb-4 sm:float-left sm:mb-2 sm:mr-5 sm:w-64">
                <div className="flex items-center gap-3 border border-border bg-surface p-3">
                  <button
                    type="button"
                    title={audioPlaying ? 'Pausar audio' : 'Reproducir audio'}
                    aria-label={audioPlaying ? 'Pausar audio' : 'Reproducir audio'}
                    onClick={() => setAudioPlaying(!audioPlaying)}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-primary text-primary-foreground transition-transform hover:scale-105"
                  >
                    {audioPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Audio exclusivo
                    </p>
                    <div className="mt-1 h-1 w-full bg-border">
                      <div className="h-full w-1/3 bg-primary transition-all" />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">0:00 / 3:45</p>
                  </div>
                </div>
              </div>

              <div className="text-sm leading-[1.8] text-foreground/85">
                {article.body.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
              <div className="clear-both" />
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
              <button
                type="button"
                title={liked ? 'Quitar me gusta' : 'Dar me gusta'}
                aria-label={liked ? 'Quitar me gusta' : 'Dar me gusta'}
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                <span>{formatCount(article.likes + (liked ? 1 : 0))}</span>
              </button>
              <button
                type="button"
                title="Compartir noticia"
                aria-label="Compartir noticia"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Share2 size={16} />
                <span>Compartir</span>
              </button>
            </div>

            <AdPlaceholder size="leaderboard" className="mt-8" />
          </div>

          <aside className="space-y-6">
            <div className="border border-border p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mas noticias de {article.category.name}
              </h3>
              <div className="space-y-0">
                {sidebarArticles.map((a) => (
                  <NewsCard key={a.id} article={a} variant="compact" />
                ))}
              </div>
            </div>

            <AdPlaceholder size="rectangle" className="mx-auto" />
            <AdPlaceholder size="rectangle" className="mx-auto" />
          </aside>
        </div>
      </article>
    </PublicSiteLayout>
  );
}
