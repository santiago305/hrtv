import React, { useState } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import PublicSiteLayout from "@/layouts/public-site-layout";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Correo electrónico inválido").max(255),
  subject: z.string().trim().min(1, "El asunto es obligatorio").max(200),
  message: z.string().trim().min(1, "El mensaje es obligatorio").max(2000),
});

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSent(true);
  };

  return (
    <PublicSiteLayout title="Contáctanos - HRTV">
      <div className="container-main py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          <h1 className="text-2xl font-bold text-foreground">Contáctanos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ¿Tienes una historia, comentario o sugerencia? Nos encantaría escucharte.
          </p>

          <AdPlaceholder size="leaderboard" className="mt-6" />

          {sent ? (
            <div className="mt-8 border border-primary/20 bg-primary/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary">
                <Send size={18} className="text-primary-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Mensaje enviado</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Gracias por contactarnos. Responderemos a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nombre
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    placeholder="Tu nombre"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-accent">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    placeholder="tu@correo.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-accent">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Asunto
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Asunto del mensaje"
                />
                {errors.subject && <p className="mt-1 text-xs text-accent">{errors.subject}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mensaje
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-3 text-muted-foreground" />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    placeholder="Escribe tu mensaje..."
                  />
                </div>
                {errors.message && <p className="mt-1 text-xs text-accent">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Send size={14} />
                Enviar mensaje
              </button>
            </form>
          )}

          <AdPlaceholder size="banner" className="mt-10" />
        </motion.div>
      </div>
    </PublicSiteLayout>
  );
};

export default ContactPage;