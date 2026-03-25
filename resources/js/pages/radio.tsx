import React, { useState } from "react";
import PublicSiteLayout from "@/layouts/public-site-layout";
import { NewsCard } from "@/components/NewsCard";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { mockArticles } from "@/data/mockData";
import { Play, Pause, Volume2, Radio as RadioIcon } from "lucide-react";

const RadioPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PublicSiteLayout title="HRTV Radio - Escucha nuestro noticiero en vivo">
      <div className="container-main py-12">
        {/* Radio Hero */}
        <div className="relative overflow-hidden border border-primary/20 bg-surface-alt p-8 sm:p-12">
          <div className="absolute inset-0 opacity-10">
            {/* Waveform decorative */}
            <div className="flex h-full items-center justify-center gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary"
                  style={{
                    height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <RadioIcon size={20} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
                Radio en vivo
              </span>
            </div>

            <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
              HRTV Radio
            </h1>
            <p className="text-sm text-primary-foreground/60">
              Escucha nuestro noticiero en vivo las 24 horas
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-16 w-16 items-center justify-center bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </button>
            </div>

            {isPlaying && (
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse-live rounded-full bg-accent" />
                <span className="text-xs font-semibold text-accent">
                  Reproduciendo en vivo
                </span>
                <Volume2 size={14} className="text-primary-foreground/50" />
              </div>
            )}

            {!isPlaying && (
              <p className="text-xs text-primary-foreground/40">
                Presiona play para escuchar
              </p>
            )}
          </div>
        </div>

        <AdPlaceholder size="leaderboard" className="mt-8" />

        {/* Latest news while listening */}
        <section className="mt-12">
          <h2 className="mb-6 text-lg font-bold text-foreground">
            Noticias mientras escuchas
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockArticles.slice(0, 6).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <AdPlaceholder size="banner" className="mt-8" />
      </div>
    </PublicSiteLayout>
  );
};

export default RadioPage;