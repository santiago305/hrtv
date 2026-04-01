import { z } from 'zod';

export const newsFormSchema = z
    .object({
        category_id: z.string().trim().min(1, 'La categoria es obligatoria.'),
        sub_category_id: z.string().trim().min(1, 'La subcategoria es obligatoria.'),
        title: z.string().trim().min(1, 'El titulo es obligatorio.').max(255, 'El titulo no debe superar los 255 caracteres.'),
        excerpt: z.string().trim().optional().or(z.literal('')),
        content: z.string().trim().min(1, 'El contenido es obligatorio.'),
        cover_image: z.string().trim().optional().or(z.literal('')),
        audio_path: z.string().trim().optional().or(z.literal('')),
        images: z.string().optional(),
        videos: z.string().optional(),
        video_thumbnail: z.string().trim().optional().or(z.literal('')),
        views_count: z
            .string()
            .trim()
            .regex(/^\d+$/, 'Las visualizaciones deben ser un numero entero positivo.'),
        likes_count: z
            .string()
            .trim()
            .regex(/^\d+$/, 'Los me gusta deben ser un numero entero positivo.'),
        published_at: z.string().optional(),
        is_breaking: z.boolean(),
        is_featured: z.boolean(),
        is_published: z.boolean(),
    })
    .superRefine((data, ctx) => {
        const hasVideos = data.videos !== undefined && data.videos.split(/\r\n|\r|\n/).some((item) => item.trim().length > 0);

        if (hasVideos && data.video_thumbnail.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['video_thumbnail'],
                message: 'La miniatura del video es obligatoria cuando registras videos.',
            });
        }
    });

export type NewsFormData = z.infer<typeof newsFormSchema>;
