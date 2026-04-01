import { z } from 'zod';

export const newsFormSchema = z
    .object({
        category_id: z.string().trim().min(1, 'La categoria es obligatoria.'),
        sub_category_id: z.string().trim().optional().or(z.literal('')),
        title: z.string().trim().min(1, 'El titulo es obligatorio.').max(255, 'El titulo no debe superar los 255 caracteres.'),
        excerpt: z.string().trim().optional().or(z.literal('')),
        content: z.string().trim().min(1, 'El contenido es obligatorio.'),
        cover_image: z.string().trim().min(1, 'La foto de portada es obligatoria.'),
        audio_path: z.string().trim().optional().or(z.literal('')),
        images: z.array(z.string()).default([]),
        videos: z.array(z.string()).default([]),
        views_count: z
            .string()
            .trim()
            .regex(/^\d+$/, 'Las visualizaciones deben ser un numero entero positivo.'),
        likes_count: z
            .string()
            .trim()
            .regex(/^\d+$/, 'Los me gusta deben ser un numero entero positivo.'),
        published_at: z.string().trim().min(1, 'La fecha es obligatoria.'),
        is_breaking: z.boolean(),
        is_featured: z.boolean(),
        is_published: z.boolean(),
    })
    .superRefine((data, ctx) => {
        const hasImages = data.images.length > 0;
        const hasVideos = data.videos.length > 0;

        if (!hasImages && !hasVideos) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['images'],
                message: 'Debes subir al menos imagenes o videos.',
            });
        }
    });

export type NewsFormData = z.infer<typeof newsFormSchema>;
