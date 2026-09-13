import { z } from "zod";
import { optionalUrl } from "@/lib/admin/parse";

const navItem = z.object({
  label: z.string().trim().min(1).max(40),
  href: z.string().trim().min(1).max(200),
});

const footerGroup = z.object({
  title: z.string().trim().min(1).max(40),
  links: z.array(navItem),
});

export const settingsInputSchema = z.object({
  companyName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().max(160).optional(),
  contactEmail: z.email(),
  contactPhone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(240).optional(),
  
  logoType: z.enum(["image", "text"]).default("image"),
  logoText: z.string().trim().max(40).optional(),
  
  navigationJson: z.string().optional().transform(v => v ? JSON.parse(v) : []).pipe(z.array(navItem)),
  ctaLabel: z.string().trim().max(40).optional(),
  ctaUrl: z.string().trim().max(200).optional(),
  
  footerGroupsJson: z.string().optional().transform(v => v ? JSON.parse(v) : []).pipe(z.array(footerGroup)),
  
  linkedin: optionalUrl.optional(),
  x: optionalUrl.optional(),
  footerText: z.string().trim().max(400).optional(),
  seoTitle: z.string().trim().max(120).optional(),
  seoDescription: z.string().trim().max(320).optional(),
});
