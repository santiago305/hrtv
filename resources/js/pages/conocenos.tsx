import React from "react";
import PublicSiteLayout from "@/layouts/public-site-layout";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Francisco Arturo Montes Chapilliquen",
    role: "Jefe del Portal de Halcon TV y Radio",
    description:
      "lidera al equipo que trabaja en conjunto para ofrecer una experiencia de transmision excepcional.",
  },
  {
    name: "Javier Angel Chininin Calderon",
    role: "Productor General",
    description:
      "supervisa la calidad y coherencia de nuestra programacion.",
  },
  {
    name: "Woody Marley Abad Morocho",
    role: "Redaccion y edicion",
    description:
      "maneja la redaccion y edicion de contenidos.",
  },
  {
    name: "Renato Ayosa Sandoval",
    role: "Produccion audiovisual",
    description:
      "forma parte del equipo de produccion y es responsable de poner al aire los programas de television, ademas de los productos audiovisuales.",
  },
];

const corporateValues = [
  {
    title: "Responsabilidad Civica",
    desc:
      "Reconocemos nuestro deber hacia la sociedad y el mundo en general, y actuamos de manera etica y responsable para contribuir positivamente.",
  },
  {
    title: "Transparencia",
    desc:
      "Operamos con integridad y transparencia en todas nuestras acciones y comunicaciones.",
  },
  {
    title: "Innovacion",
    desc:
      "Buscamos soluciones creativas y nuevas formas de abordar los desafios globales en busca de un mundo mejor.",
  },
  {
    title: "Diversidad e igualdad",
    desc:
      "Valoramos la diversidad en todas sus formas y nos esforzamos por garantizar que todos tengan igualdad de oportunidades.",
  },
];

const AboutPage: React.FC = () => {
  return (
    <PublicSiteLayout title="Conocenos">
      <div className="container-main py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-12 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=500&fit=crop"
              alt="Equipo HRTV"
              className="aspect-21/9 w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-surface-alt/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Conocenos</h1>
              <p className="mt-1 text-sm text-primary-foreground/70">El equipo detras de HRTV</p>
            </div>
          </div>

          <AdPlaceholder size="leaderboard" className="mb-10" />

          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Nuestro equipo</h2>
              <p className="text-sm leading-[1.8] text-foreground/80">
                Nuestro equipo trabaja en conjunto para ofrecer una experiencia de transmision
                solida, cercana y coherente con la identidad de Halcon TV y Radio.
              </p>
            </div>

            <div className="border-l-2 border-primary pl-5">
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <p key={member.name} className="text-sm leading-[1.8] text-foreground/80">
                    <strong>{member.name}</strong>, como {member.role}, {member.description}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Mision y vision</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-primary">Mision</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-foreground/80">
                    Proporcionar contenidos educativos, informativos y entretenidos que inspiren a
                    la audiencia a tomar accion, fomentando asi un cambio positivo en la sociedad y
                    promoviendo valores que fortalezcan el bienestar de todos, buscando siempre
                    contribuir a un mundo mas saludable y enriquecedor para todos.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-primary">Vision</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-foreground/80">
                    Liderar el camino hacia un mundo donde la busqueda del bienestar comun y el
                    amor como principio rector sean la base de nuestras acciones. Enfocados en el
                    deber civico y el enfoque geopolitico, aspiramos a crear sociedades mas
                    saludables, culturalmente enriquecedoras y justas, donde cada individuo tenga la
                    oportunidad de prosperar y contribuir al bienestar global.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Nuestros valores corporativos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {corporateValues.map((value) => (
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
                  { num: "24/7", label: "Transmision" },
                  { num: "190+", label: "Paises" },
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
