import PublicSiteLayout from '@/components/public-site-layout';

export default function Inicio() {
    return (
        <PublicSiteLayout title="Inicio">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-10">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Portada</p>
                <h1 className="mt-4 text-5xl font-semibold text-white">Soy inicio</h1>
            </section>
        </PublicSiteLayout>
    );
}
