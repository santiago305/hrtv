import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

interface FooterProps {
    logoUrl?: string;
}

export function Footer(logoUrl?: FooterProps) {
    const currentLogoUrl = logoUrl?.logoUrl ?? '/storage/logo.png';
    const { footerCategories = [] } = usePage<SharedData>().props;

    return (
        <footer className="border-t border-border bg-surface-alt text-primary-foreground">
            <div className="container-main py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-1.5">
                            <div className="flex h-15 w-15 items-center justify-center">
                                <img src={currentLogoUrl} alt="HRTV" className="h-15 w-auto object-contain" />
                            </div>
                            <span className="text-base font-bold tracking-tight">HRTV</span>
                        </div>
                        <p className="text-sm leading-relaxed text-primary-foreground/60">
                            Una mirada al mundo. Noticias, analisis y entretenimiento las 24 horas.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40">Categorias</h4>
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                            {footerCategories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`${route('news.index')}?categoria=${cat.slug}`}
                                        className="text-sm text-primary-foreground/60 transition-colors hover:text-primary"
                                    >
                                        {cat.name}
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
