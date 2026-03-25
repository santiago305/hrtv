import PublicSiteLayout from '@/components/public-site-layout';

export default function Radio() {
    return (
        <PublicSiteLayout title="Radio">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-10">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Radio</p>
                <h1 className="mt-4 text-5xl font-semibold text-white">Seccion de radio</h1>
                <p className="mt-4 max-w-2xl text-stone-300">Aqui ira la presencia o seccion de radio del sitio.</p>
            </section>
        </PublicSiteLayout>
    );
}
