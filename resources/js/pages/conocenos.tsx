import PublicSiteLayout from '@/layouts/public-site-layout';

export default function Conocenos() {
    return (
        <PublicSiteLayout title="Conocenos">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-10">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Conocenos</p>
                <h1 className="mt-4 text-5xl font-semibold text-white">Pagina de conocenos</h1>
                <p className="mt-4 max-w-2xl text-stone-300">Este espacio queda listo para presentar la historia, vision y equipo.</p>
            </section>
        </PublicSiteLayout>
    );
}
