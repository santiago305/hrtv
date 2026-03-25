import React from "react";
import PublicSiteLayout from "@/layouts/public-site-layout";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { motion } from "framer-motion";

const AboutPage: React.FC = () => {
  return (
    <PublicSiteLayout title="Conócenos">
      <div className="container-main py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero */}
          <div className="relative mb-12 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=500&fit=crop"
              alt="Equipo HRTV"
              className="aspect-21/9 w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-surface-alt/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Conócenos</h1>
              <p className="mt-1 text-sm text-primary-foreground/70">El equipo detrás de HRTV</p>
            </div>
          </div>

          <AdPlaceholder size="leaderboard" className="mb-10" />

          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Nuestra Misión</h2>
              <p className="text-sm leading-[1.8] text-foreground/80">
                HRTV nació con una visión clara: ofrecer una mirada al mundo sin filtros ni
                sesgos. Somos un equipo de periodistas, productores y tecnólogos comprometidos
                con la verdad y la transparencia informativa.
              </p>
              <p className="text-sm leading-[1.8] text-foreground/80">
                Desde nuestra fundación, hemos cubierto los eventos más importantes del
                panorama nacional e internacional, llevando información verificada y
                análisis profundo a millones de personas a través de nuestra plataforma
                digital, radio y streaming en vivo.
              </p>
            </div>

            <div className="border-l-2 border-primary pl-5">
              <blockquote className="text-base italic text-foreground/70">
                "Creemos que la información es poder, y nuestro deber es poner ese poder
                en manos de cada ciudadano."
              </blockquote>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">— Fundadores de HRTV</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Nuestros Valores</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Verdad", desc: "Comprometidos con la verificación de hechos y la precisión informativa." },
                  { title: "Innovación", desc: "Utilizamos la última tecnología para llevar las noticias de forma inmediata." },
                  { title: "Transparencia", desc: "Nuestras fuentes y métodos están siempre abiertos al escrutinio público." },
                ].map((value) => (
                  <div key={value.title} className="border border-border p-5">
                    <h3 className="text-sm font-bold text-primary">{value.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <AdPlaceholder size="banner" />

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Cobertura</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { num: "24/7", label: "Transmisión" },
                  { num: "190+", label: "Países" },
                  { num: "2M+", label: "Lectores" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-border p-4">
                    <p className="text-xl font-bold text-primary">{stat.num}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PublicSiteLayout>
  );
};

export default AboutPage;