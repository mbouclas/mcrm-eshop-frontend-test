import { z, defineCollection } from 'astro:content';

const simpleCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        image: z.string().optional(),
        category: z.string().optional(),
        file: z.object({
            title: z.string(),
            url: z.string()
        }).optional(),
        galleryJson: z.string().optional(),// grabs a photo collection from a json file
        gallery: z.object({
            title: z.string().optional(),
            url: z.string()
        }).array().optional(),
        pubDate: z.date().optional(),
        tags: z.string().array().optional(),
    }),
});


export const collections = {
    'page': simpleCollection,
};
