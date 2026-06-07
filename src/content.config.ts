import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()),
      cover: image().optional(),
      description: z.string().optional(),
      featured: z.boolean().default(false),
    }),
});



const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    description: z.string().optional(),
  }),
});

const comics = defineCollection({
  loader: glob({ base: "./src/content/comics", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
  }),
});

const comicChapters = defineCollection({
  loader: glob({ base: "./src/content/comicChapters", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      comic: z.string(),
      slug: z.string(),
      title: z.string(),
      description: z.string().optional(),
      order: z.number().default(0),
      preview: image().optional(),
    }),
});


export const collections = {
  projects,
  blog,
  comics,
  comicChapters,
};
