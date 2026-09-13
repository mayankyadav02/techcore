import { z } from "zod";

export const PAGE_SEO_KEYS = [
  "blog",
  "careers",
  "contact",
  "industries",
  "privacy",
  "projects",
  "quote",
  "services",
  "solutions",
  "terms",
] as const;

export const pageSeoInputSchema = z.object({
  page: z.enum(PAGE_SEO_KEYS),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
});
