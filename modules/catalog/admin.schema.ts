import { z } from "zod";
import { contentStatuses, slugPattern } from "@/modules/shared/enums";
import { optionalUrl } from "@/lib/admin/parse";

const slugField = z
  .string()
  .trim()
  .max(80)
  .refine((value) => value === "" || slugPattern.test(value), "Use a lowercase slug");

export const serviceInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: slugField,
  summary: z.string().trim().min(10).max(400),
  body: z.string().trim().min(20).max(20000),
  icon: z.string().trim().max(40).optional(),
  highlights: z.array(z.string().trim().min(1).max(200)).max(20),
  features: z.array(z.string().trim().min(1).max(200)).max(20),
  technologies: z.array(z.string().trim().min(1).max(80)).max(30),
  benefits: z.array(z.string().trim().min(1).max(200)).max(20),
  process: z.array(z.string().trim().min(1).max(200)).max(20),
  status: z.enum(contentStatuses),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const solutionInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: slugField,
  summary: z.string().trim().min(10).max(400),
  body: z.string().trim().max(20000).optional(),
  problem: z.string().trim().min(10).max(4000),
  approach: z.string().trim().min(10).max(4000),
  outcomes: z.array(z.string().trim().min(1).max(200)).max(20),
  features: z.array(z.string().trim().min(1).max(200)).max(20),
  technology: z.array(z.string().trim().min(1).max(80)).max(30),
  status: z.enum(contentStatuses),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const industryInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: slugField,
  summary: z.string().trim().min(10).max(400),
  body: z.string().trim().max(20000).optional(),
  focus: z.array(z.string().trim().min(1).max(200)).max(20),
  status: z.enum(contentStatuses),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const projectInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: slugField,
  clientName: z.string().trim().min(2).max(120),
  sector: z.string().trim().max(80).optional(),
  summary: z.string().trim().min(10).max(400),
  overview: z.string().trim().max(8000).optional(),
  challenge: z.string().trim().min(10).max(8000),
  solution: z.string().trim().min(10).max(8000),
  results: z.array(z.string().trim().min(1).max(200)).max(20),
  features: z.array(z.string().trim().min(1).max(200)).max(20),
  technology: z.array(z.string().trim().min(1).max(80)).max(30),
  heroImageUrl: optionalUrl.optional(),
  galleryUrls: z.array(z.string().url().max(500)).max(12),
  year: z.number().int().min(2000).max(2100).optional(),
  status: z.enum(contentStatuses),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});
