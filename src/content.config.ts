import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    language: z.enum(['zh-CN', 'en']),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { notes };
