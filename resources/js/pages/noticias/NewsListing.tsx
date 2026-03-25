import PublicSiteLayout from '@/layouts/public-site-layout';
import { Link } from '@inertiajs/react';

interface NewsItem {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published_at: string;
}

interface NewsListingProps {
    newsItems: NewsItem[];
}

export default function NewsListing({ newsItems }: NewsListingProps) {
    return (
        <PublicSiteLayout title="Noticias">
            <section className="mb-8">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Noticias</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">News Listing</h1>
                <p className="mt-3 max-w-2xl text-stone-300">Aqui se listan las noticias disponibles del sitio.</p>
            </section>

            <section className="grid gap-6">
                {newsItems.map((item) => (
                    <article key={item.slug} className="rounded-3xl border border-white/10 bg-white/5 p-8">
                        <p className="text-sm text-amber-300">{item.published_at}</p>
                        <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
                        <p className="mt-3 max-w-3xl text-stone-300">{item.excerpt}</p>
                        <Link
                            href={route('news.show', { slug: item.slug })}
                            className="mt-6 inline-flex rounded-full border border-amber-400 px-5 py-2 text-sm text-amber-300 transition hover:bg-amber-400 hover:text-stone-950"
                        >
                            Ver noticia
                        </Link>
                    </article>
                ))}
            </section>
        </PublicSiteLayout>
    );
}
