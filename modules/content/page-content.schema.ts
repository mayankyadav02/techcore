import { z } from "zod";

// Allowed page keys for shared page content
export const pageContentKeys = [
  "services",
  "solutions",
  "industries",
  "projects",
  "blog",
  "careers",
  "contact",
  "quote",
] as const;

type PageKey = (typeof pageContentKeys)[number];

// Schema for a page content document
export const pageContentSchema = z.object({
  key: z.enum(pageContentKeys),
  // Hero fields – all optional to allow fallbacks
  heroEyebrow: z.string().trim().max(80).optional(),
  heroTitle: z.string().trim().max(160).optional(),
  heroDescription: z.string().trim().max(320).optional(),
  heroPrimaryLabel: z.string().trim().max(40).optional(),
  heroPrimaryUrl: z.string().trim().max(200).optional(),
  heroSecondaryLabel: z.string().trim().max(40).optional(),
  heroSecondaryUrl: z.string().trim().max(200).optional(),
  // Optional CTA fields – stored in the same document for simplicity
  primaryCta: z.object({
    label: z.string().trim().max(40).optional(),
    href: z.string().trim().max(200).optional(),
  }).optional(),
  secondaryCta: z.object({
    label: z.string().trim().max(40).optional(),
    href: z.string().trim().max(200).optional(),
  }).optional(),
});

export type PageContentInput = z.infer<typeof pageContentSchema>;
