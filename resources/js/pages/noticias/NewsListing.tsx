import { Link } from '@inertiajs/react';
import { NewsCard } from '@/components/NewsCard';
import { categories, mockArticles } from '@/data/mockData';
import PublicSiteLayout from '@/layouts/public-site-layout';

export default function NewsListing() {
    const breakingArticle = mockArticles.find((article) => article.isBreaking) ?? mockArticles[0];
    const secondaryArticles = mockArticles.slice(1, 3);

    return (
        <PublicSiteLayout title="Noticias">
            <section className="container-main py-12">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Noticias</p>
                        <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">Cobertura y actualidad de HRTV</h1>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                            Un listado editorial conectado con la misma data de inicio para ir armando una experiencia coherente
                            entre portada, categorias y detalle.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 5).map((category) => (
                            <span
                                key={category.id}
                                className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Link
                        href={route('news.show', { slug: breakingArticle.slug })}
                        className="group relative overflow-hidden border border-border bg-surface-alt lg:col-span-2"
                    >
                        <div className="grid h-full md:grid-cols-2">
                            <div className="relative min-h-[320px] overflow-hidden">
                                <img
                                    src={breakingArticle.image}
                                    alt={breakingArticle.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-alt/90 to-transparent md:bg-gradient-to-r" />
                            </div>

                            <div className="flex flex-col justify-between p-8">
                                <div>
                                    <span className="inline-flex items-center gap-2 bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-foreground" />
                                        Destacada
                                    </span>
                                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                                        {breakingArticle.category.name}
                                    </p>
                                    <h2 className="mt-3 text-3xl font-bold leading-tight text-primary-foreground">
                                        {breakingArticle.title}
                                    </h2>
                                    <p className="mt-4 text-sm leading-7 text-primary-foreground/70">
                                        {breakingArticle.summary}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center justify-between gap-4 text-xs text-primary-foreground/60">
                                    <span>{new Date(breakingArticle.publishedAt).toLocaleDateString('es-ES')}</span>
                                    <span className="font-semibold uppercase tracking-[0.2em] text-primary-foreground">Ver noticia</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="grid gap-6">
                        {secondaryArticles.map((article) => (
                            <NewsCard key={article.id} article={article} variant="compact" className="bg-background px-3" />
                        ))}
                    </div>
                </div>
            </section>

            <section className="container-main pb-16">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Todas las noticias</h2>
                    <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{mockArticles.length} articulos</span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {mockArticles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
        </PublicSiteLayout>
    );
}
