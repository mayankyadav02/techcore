import { z } from "zod";
import { blogStatuses, slugPattern } from "@/modules/shared/enums";
import { optionalUrl } from "@/lib/admin/parse";

export const blogInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .max(80)
    .refine((value) => value === "" || slugPattern.test(value), "Use a lowercase slug"),
  excerpt: z.string().trim().min(10).max(400),
  body: z.string().trim().min(20).max(50000),
  authorName: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(40),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  heroImageUrl: optionalUrl.optional(),
  readTime: z.string().trim().max(20).optional(),
  status: z.enum(blogStatuses),
  featured: z.boolean(),
  publishedAt: z.string().optional(),
});
