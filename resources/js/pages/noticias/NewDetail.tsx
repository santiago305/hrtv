import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Heart, Share2 } from 'lucide-react';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { NewsCard } from '@/components/NewsCard';
import PublicSiteLayout from '@/layouts/public-site-layout';
import type { NewsArticle } from '@/types/news';
import AudioNews from '../news/components/AudioNews';
import CarouselNews from '../news/components/CarouselNews';
import DescriptionNews from '../news/components/DescriptionNews';
import ExcerptNews from '../news/components/ExcerptNews';
import NewsMeta from '../news/components/NewsMeta';
import TitleNews from '../news/components/TitleNews';
import VideoNews from '../news/components/VideoNews';

type NewsDetailPageProps = {
  article: NewsArticle;
  sidebarArticles: NewsArticle[];
};

export default function NewsDetailPage() {
  const [liked, setLiked] = useState(false);
  const { article, sidebarArticles = [] } = usePage<NewsDetailPageProps>().props;
  const articleImages = article.images && article.images.length > 0 ? article.images : [article.image];
  const articleVideos = article.videoUrl ? [article.videoUrl] : [];

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
              {article.subcategory ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {article.subcategory.name}
                </span>
              ) : null}
            </div>

            <TitleNews title={article.title} />
            <NewsMeta authorName={article.author} publishedAt={article.publishedAt} viewsCount={article.views} />

            <CarouselNews images={articleImages} />

            <ExcerptNews excerpt={article.summary} />

            <div className="mt-6">
              <AudioNews src={article.audioUrl} />
              <DescriptionNews description={article.body} />
              <div className="clear-both" />
            </div>

            {articleVideos.length > 0 ? <VideoNews video={articleVideos} /> : null}

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
                {sidebarArticles.map((item) => (
                  <NewsCard key={item.id} article={item} variant="compact" />
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
