import PublicSiteLayout from '@/layouts/public-site-layout';
import { Link } from '@inertiajs/react';

interface NewsItem {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published_at: string;
}

interface NewDetailProps {
    newsItem: NewsItem;
}

export default function NewDetail({ newsItem }: NewDetailProps) {
    return (
        <PublicSiteLayout title={newsItem.title}>
            <article className="rounded-3xl border border-white/10 bg-white/5 p-10">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Detalle de noticia</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">{newsItem.title}</h1>
                <p className="mt-3 text-sm text-stone-400">{newsItem.published_at}</p>
                <p className="mt-6 text-lg text-stone-200">{newsItem.excerpt}</p>
                <div className="mt-8 max-w-3xl text-base leading-8 text-stone-300">{newsItem.content}</div>
                <Link
                    href={route('news.index')}
                    className="mt-10 inline-flex rounded-full border border-white/15 px-5 py-2 text-sm text-stone-200 transition hover:border-amber-400 hover:text-amber-300"
                >
                    Volver a noticias
                </Link>
            </article>
        </PublicSiteLayout>
    );
}
