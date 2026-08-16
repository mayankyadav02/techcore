import { z } from "zod";
import { optionalUrl } from "@/lib/admin/parse";

export const settingsInputSchema = z.object({
  companyName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().max(160).optional(),
  contactEmail: z.email(),
  contactPhone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(240).optional(),
  linkedin: optionalUrl.optional(),
  x: optionalUrl.optional(),
  footerText: z.string().trim().max(400).optional(),
  seoTitle: z.string().trim().max(120).optional(),
  seoDescription: z.string().trim().max(320).optional(),
});
