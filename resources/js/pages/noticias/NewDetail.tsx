import { usePage } from '@inertiajs/react';
import { Heart, Share2 } from 'lucide-react';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { NewsCard } from '@/components/NewsCard';
import { useNewsEngagement } from '@/hooks/use-news-engagement';
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
  const { article, sidebarArticles = [] } = usePage<NewsDetailPageProps>().props;
  const articleImages = article.images && article.images.length > 0 ? article.images : [article.image];
  const articleVideos = article.videoUrl ? [article.videoUrl] : [];
  const { views, likes, hasLiked, likeSubmitting, like } = useNewsEngagement({
    newsId: article.id,
    newsSlug: article.slug,
    initialViews: article.views,
    initialLikes: article.likes,
  });

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
            <NewsMeta authorName={article.author} publishedAt={article.publishedAt} viewsCount={views} />

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
                title={hasLiked ? 'Ya marcaste me gusta' : 'Dar me gusta'}
                aria-label={hasLiked ? 'Ya marcaste me gusta' : 'Dar me gusta'}
                onClick={() => void like()}
                disabled={hasLiked || likeSubmitting}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  hasLiked ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
                <span>{formatCount(likes)}</span>
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
