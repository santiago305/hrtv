import { Link } from '@inertiajs/react';
import { NewsCard } from '@/components/NewsCard';
import { mockArticles } from '@/data/mockData';
import PublicSiteLayout from '@/layouts/public-site-layout';

interface NewDetailProps {
    slug: string;
}

export default function NewDetail({ slug }: NewDetailProps) {
    const newsItem = mockArticles.find((article) => article.slug === slug);

    if (!newsItem) {
        return (
            <PublicSiteLayout title="Noticia no encontrada">
                <section className="container-main py-16">
                    <h1 className="text-3xl font-bold text-foreground">Noticia no encontrada</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                        La noticia que buscas no existe en la data actual. Puedes volver al listado general para seguir explorando.
                    </p>
                    <Link
                        href={route('news.index')}
                        className="mt-6 inline-flex rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                    >
                        Volver a noticias
                    </Link>
                </section>
            </PublicSiteLayout>
        );
    }

    const relatedArticles = mockArticles.filter((article) => article.slug !== newsItem.slug).slice(0, 3);

    return (
        <PublicSiteLayout title={newsItem.title}>
            <article className="container-main py-12">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href={route('news.index')}
                        className="mb-6 inline-flex text-xs font-semibold uppercase tracking-[0.25em] text-primary"
                    >
                        Volver a noticias
                    </Link>

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{newsItem.category.name}</p>
                    <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl">{newsItem.title}</h1>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">{newsItem.summary}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>{newsItem.author}</span>
                        <span>{new Date(newsItem.publishedAt).toLocaleDateString('es-ES')}</span>
                        <span>{newsItem.views.toLocaleString()} vistas</span>
                    </div>

                    <div className="mt-8 overflow-hidden border border-border">
                        <img src={newsItem.image} alt={newsItem.title} className="h-full w-full object-cover" />
                    </div>

                    <div className="prose prose-neutral mt-10 max-w-none text-foreground">
                        {newsItem.body.split('\n\n').map((paragraph) => (
                            <p key={paragraph} className="mb-6 text-base leading-8 text-foreground">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </article>

            <section className="container-main pb-16">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Relacionadas</h2>
                    <Link href={route('news.index')} className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        Ver mas
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {relatedArticles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
        </PublicSiteLayout>
    );
}
