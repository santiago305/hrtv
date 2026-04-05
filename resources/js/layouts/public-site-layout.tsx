import type { PropsWithChildren } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SeoHead } from '@/components/seo/seo-head';
import { navItems } from '@/data/mockData';

interface PublicSiteLayoutProps extends PropsWithChildren {
    title: string;
    description?: string;
    path?: string;
    image?: string | null;
    type?: 'website' | 'article' | 'video.other';
    robots?: string;
    keywords?: string[];
    author?: string;
    publishedTime?: string | null;
    section?: string;
    videoUrl?: string | null;
    jsonLd?: Record<string, unknown> | null;
}

export default function PublicSiteLayout({ children, title, ...seo }: PublicSiteLayoutProps) {
    return (
        <>
            <SeoHead title={title} description={seo.description ?? 'Noticias, transmisiones en vivo y cobertura informativa de HRTV.'} {...seo}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </SeoHead>

            <div className="flex min-h-screen flex-col">
                <Header navItems={navItems} />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}
