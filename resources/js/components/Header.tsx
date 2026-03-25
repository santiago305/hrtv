import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavItem } from '@/types/news';

interface HeaderProps {
    navItems: NavItem[];
    logoUrl?: string;
}

export function Header({ navItems, logoUrl }: HeaderProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { url } = usePage();
    const visibleItems = navItems.filter((item) => item.visible);

    const isActive = (path: string) => {
        if (path === '/') return url === '/';

        return url === path || url.startsWith(`${path}?`) || url.startsWith(`${path}/`);
    };

    const isFewItems = visibleItems.length <= 2;

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="container-main">
                <div className="flex h-14 items-center justify-between">
                    <Link href={route('home')} className="flex items-center gap-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt="HRTV" className="h-8" />
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <div className="flex h-8 w-8 items-center justify-center bg-primary">
                                    <span className="text-xs font-bold text-primary-foreground">HR</span>
                                </div>
                                <span className="text-base font-bold tracking-tight text-foreground">HRTV</span>
                            </div>
                        )}
                    </Link>

                    {!isFewItems && (
                        <nav className="hidden items-center gap-1 md:flex">
                            {visibleItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                                        isActive(item.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {item.label}
                                    {isActive(item.path) && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />}
                                </Link>
                            ))}
                        </nav>
                    )}

                    <div className="hidden items-center gap-3 md:flex">
                        <div className="flex items-center gap-1.5">
                            <span className="inline-block h-2 w-2 animate-pulse-live rounded-full bg-accent" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent">En Vivo</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-9 w-9 items-center justify-center text-foreground md:hidden"
                        aria-label="Menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="overflow-hidden border-t border-border bg-background md:hidden">
                    <nav className="container-main flex flex-col gap-1 py-4">
                        {visibleItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive(item.path) ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-2 flex items-center gap-1.5 px-3">
                            <span className="inline-block h-2 w-2 animate-pulse-live rounded-full bg-accent" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent">En Vivo</span>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
