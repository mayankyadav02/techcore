import { z } from "zod";

export const legalPageKeys = ["privacy", "terms"] as const;

type LegalPageKey = (typeof legalPageKeys)[number];

export const legalPageSchema = z.object({
  key: z.enum(legalPageKeys),
  // Store raw HTML or markdown content; optional fallback
  content: z.string().optional(),
});

export type LegalPageInput = z.infer<typeof legalPageSchema>;
