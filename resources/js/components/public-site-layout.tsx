import { Head, Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

const navigation = [
    { label: 'Inicio', href: route('home') },
    { label: 'Noticias', href: route('news.index') },
    { label: 'Radio', href: route('radio') },
    { label: 'Conocenos', href: route('about') },
    { label: 'Contacto', href: route('contact') },
];

interface PublicSiteLayoutProps extends PropsWithChildren {
    title: string;
}

export default function PublicSiteLayout({ title, children }: PublicSiteLayoutProps) {
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-stone-950 text-stone-100">
                <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
                    <header className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                        <Link href={route('home')} className="text-2xl font-semibold tracking-[0.2em] uppercase">
                            HRTV
                        </Link>

                        <nav className="flex flex-wrap gap-3 text-sm text-stone-300">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-amber-400 hover:text-amber-300"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </header>

                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </>
    );
}
