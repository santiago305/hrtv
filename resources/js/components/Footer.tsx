import { Link } from '@inertiajs/react';
import { categories } from '@/data/mockData';

export function Footer() {
    return (
        <footer className="border-t border-border bg-surface-alt text-primary-foreground">
            <div className="container-main py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-1.5">
                            <div className="flex h-8 w-8 items-center justify-center bg-primary">
                                <span className="text-xs font-bold text-primary-foreground">HR</span>
                            </div>
                            <span className="text-base font-bold tracking-tight">HRTV</span>
                        </div>
                        <p className="text-sm leading-relaxed text-primary-foreground/60">
                            Una mirada al mundo. Noticias, analisis y entretenimiento las 24 horas.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40">Categorias</h4>
                        <ul className="space-y-1.5">
                            {categories.slice(0, 6).map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/noticias?categoria=${cat.slug}`}
                                        className="text-sm text-primary-foreground/60 transition-colors hover:text-primary"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40">Popular</h4>
                        <ul className="space-y-1.5">
                            {categories.flatMap((c) => c.subcategories || []).slice(0, 6).map((sub) => (
                                <li key={sub.id}>
                                    <Link
                                        href={`/noticias?subcategoria=${sub.slug}`}
                                        className="text-sm text-primary-foreground/60 transition-colors hover:text-primary"
                                    >
                                        {sub.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40">Empresa</h4>
                        <ul className="space-y-1.5">
                            <li>
                                <Link href={route('about')} className="text-sm text-primary-foreground/60 transition-colors hover:text-primary">
                                    Conocenos
                                </Link>
                            </li>
                            <li>
                                <Link href={route('contact')} className="text-sm text-primary-foreground/60 transition-colors hover:text-primary">
                                    Contactanos
                                </Link>
                            </li>
                            <li>
                                <Link href={route('radio')} className="text-sm text-primary-foreground/60 transition-colors hover:text-primary">
                                    Radio
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-primary-foreground/10 pt-6">
                    <p className="text-center text-xs text-primary-foreground/40">
                        &copy; {new Date().getFullYear()} HRTV - Una mirada al mundo. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
