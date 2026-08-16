import { z } from "zod";
import { contentStatuses } from "@/modules/shared/enums";

export const testimonialInputSchema = z.object({
  quote: z.string().trim().min(10).max(800),
  authorName: z.string().trim().min(2).max(80),
  authorRole: z.string().trim().max(160).optional(),
  company: z.string().trim().max(120).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  status: z.enum(contentStatuses),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});
