import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { navItems } from '@/data/mockData';

interface PublicSiteLayoutProps extends PropsWithChildren {
    title: string;
}

export default function PublicSiteLayout({ children, title }: PublicSiteLayoutProps) {
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col">
                <Header navItems={navItems} />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}
