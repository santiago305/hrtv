import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Play, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NewsCard } from '@/components/NewsCard';
import { PublicAdSlot } from '@/components/PublicAdSlot';
import { mockLiveStreams } from '@/data/mockData';
import PublicSiteLayout from '@/layouts/public-site-layout';
import type { NewsArticle } from '@/types/news';

interface InicioProps {
    logoUrl?: string;
}

type InicioPageProps = {
    latestNews: NewsArticle[];
};

function HeroCarousel({ logoUrl, articles }: InicioProps & { articles: NewsArticle[] }) {
  const [current, setCurrent] = useState(0);
  const heroArticles = articles.slice(0, 3);

  useEffect(() => {
    if (heroArticles.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroArticles.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroArticles.length]);

  if (heroArticles.length === 0) {
    return null;
  }

  const article = heroArticles[current];
  const currentLogoUrl = logoUrl ?? '/storage/logo.png';

  return (
    <section className="relative h-[60vh] min-h-100 max-h-150 overflow-hidden bg-surface-alt">
      {heroArticles.map((a, i) => (
        <div
          key={a.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={a.image} alt={a.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-surface-alt/95 via-surface-alt/60 to-transparent" />
        </div>
      ))}

      <div className="container-main relative flex h-full items-center">
        <div className="max-w-xl space-y-4">
          <div className="flex items-center gap-1.5">
            <div className="flex h-10 w-10 items-center justify-center">
              <img src={currentLogoUrl} alt="HRTV" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold text-primary-foreground">HRTV</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/50">
                Una mirada al mundo
              </p>
            </div>
          </div>

          {article.isBreaking && (
            <div className="inline-flex items-center gap-1.5 bg-accent px-3 py-1">
              <span className="inline-block h-1.5 w-1.5 animate-pulse-live rounded-full bg-accent-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                Ultima hora
              </span>
            </div>
          )}

          <motion.h1
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl"
          >
            {article.title}
          </motion.h1>

          <motion.p
            key={`summary-${article.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm leading-relaxed text-primary-foreground/70"
          >
            {article.summary}
          </motion.p>

          <Link
            href={route('news.show', { slug: article.slug })}
            className="inline-flex items-center gap-2 border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Leer mas
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          type="button"
          title="Noticia anterior"
          aria-label="Mostrar noticia anterior"
          onClick={() => setCurrent((prev) => (prev - 1 + heroArticles.length) % heroArticles.length)}
          className="flex h-8 w-8 items-center justify-center border border-primary-foreground/20 bg-surface-alt/50 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary"
        >
          <ChevronLeft size={14} />
        </button>
        <div className="flex gap-1.5">
          {heroArticles.map((item, i) => (
            <button
              key={item.id}
              type="button"
              title={`Ir a la noticia ${i + 1}`}
              aria-label={`Ir a la noticia ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all ${
                i === current ? 'w-6 bg-primary' : 'w-3 bg-primary-foreground/30'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          title="Siguiente noticia"
          aria-label="Mostrar siguiente noticia"
          onClick={() => setCurrent((prev) => (prev + 1) % heroArticles.length)}
          className="flex h-8 w-8 items-center justify-center border border-primary-foreground/20 bg-surface-alt/50 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}

function LatestNewsSection({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="container-main py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Ultimas Noticias</h2>
        <Link href={route('news.index')} className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
          Ver todas -&gt;
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

function LiveStreamSection() {
  const mainStream = mockLiveStreams[0];
  const otherStreams = mockLiveStreams.slice(1);

  return (
    <section className="bg-surface-alt py-12">
      <div className="container-main">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 animate-pulse-live rounded-full bg-accent" />
            <h2 className="text-lg font-bold text-primary-foreground">Streaming</h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-video overflow-hidden border border-primary/20 bg-surface-alt">
              <img src={mainStream.thumbnailUrl} alt={mainStream.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-surface-alt/40">
                <button
                  type="button"
                  title={`Reproducir ${mainStream.title}`}
                  aria-label={`Reproducir ${mainStream.title}`}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-foreground/40 bg-primary/80 text-primary-foreground transition-transform hover:scale-110"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
              {mainStream.isLive && (
                <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-accent px-2 py-0.5">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse-live rounded-full bg-accent-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                    En Vivo
                  </span>
                </div>
              )}
              {mainStream.viewers && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-surface-alt/80 px-2 py-1 backdrop-blur-sm">
                  <Users size={12} className="text-primary-foreground/70" />
                  <span className="text-[10px] font-medium text-primary-foreground/70">
                    {mainStream.viewers.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <h3 className="mt-3 text-sm font-bold text-primary-foreground">{mainStream.title}</h3>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40">
              Videos anteriores
            </h3>
            {otherStreams.map((stream) => (
              <div key={stream.id} className="group flex cursor-pointer gap-3">
                <div className="relative h-16 w-28 shrink-0 overflow-hidden">
                  <img
                    src={stream.thumbnailUrl}
                    alt={stream.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-alt/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play size={14} className="text-primary-foreground" fill="currentColor" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="line-clamp-2 text-xs font-semibold text-primary-foreground transition-colors group-hover:text-primary">
                    {stream.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MoreNewsSection({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="container-main py-12">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">Mas Noticias</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

export default function Inicio() {
  const { latestNews = [] } = usePage<InicioPageProps>().props;
  const firstBlock = latestNews.slice(0, 3);
  const secondBlock = latestNews.slice(3, 6);

  return (
    <PublicSiteLayout title="Inicio">
      <HeroCarousel articles={latestNews} />
      <PublicAdSlot slotCode="home_leaderboard_top" size="leaderboard" className="container-main mt-6" />
      <LatestNewsSection articles={firstBlock} />
      <div className="container-main pb-6">
        <PublicAdSlot slotCode="home_banner_mid" size="banner" />
      </div>
      <LiveStreamSection />
      <PublicAdSlot slotCode="home_leaderboard_bottom" size="leaderboard" className="container-main mt-6" />
      <MoreNewsSection articles={secondBlock} />
      <div className="container-main pb-12">
        <PublicAdSlot slotCode="home_banner_bottom" size="banner" />
      </div>
    </PublicSiteLayout>
  );
}
