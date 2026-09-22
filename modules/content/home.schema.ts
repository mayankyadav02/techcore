import { z } from "zod";


const safeJsonArray = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        if (!Array.isArray(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must be an array",
          });
          return z.NEVER;
        }
        return parsed;
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid JSON array",
        });
        return z.NEVER;
      }
    })
    .pipe(z.array(schema));

const packageSchema = z.object({
  name: z.string().trim().min(1).max(80),
  audience: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(320),
  includes: z.array(z.string().trim().min(1).max(120)).max(20),
  featured: z.boolean().default(false),
});

const reasonSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(320),
});

const processStepSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(320),
});

const faqSchema = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(1000),
});

export const homeInputSchema = z.object({
  // Hero
  heroEyebrow: z.string().trim().max(80).optional(),
  heroTitle: z.string().trim().max(160).optional(),
  heroDescription: z.string().trim().max(320).optional(),
  heroPrimaryLabel: z.string().trim().max(40).optional(),
  heroPrimaryUrl: z.string().trim().max(200).optional(),
  heroSecondaryLabel: z.string().trim().max(40).optional(),
  heroSecondaryUrl: z.string().trim().max(200).optional(),

  // About
  aboutEyebrow: z.string().trim().max(80).optional(),
  aboutTitle: z.string().trim().max(160).optional(),
  aboutDescription: z.string().trim().max(320).optional(),
  aboutBody: z.string().trim().max(1000).optional(),
  aboutLinkLabel: z.string().trim().max(40).optional(),
  aboutLinkUrl: z.string().trim().max(200).optional(),
  aboutImageId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID").optional().or(z.literal("")),
  heroImageIds: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID").optional().or(z.literal(""))).optional(),

  // Packages
  packagesEyebrow: z.string().trim().max(80).optional(),
  packagesTitle: z.string().trim().max(160).optional(),
  packagesDescription: z.string().trim().max(320).optional(),
  packagesJson: safeJsonArray(packageSchema),

  // Why TechCore
  reasonsEyebrow: z.string().trim().max(80).optional(),
  reasonsTitle: z.string().trim().max(160).optional(),
  reasonsJson: safeJsonArray(reasonSchema),

  // Process
  processEyebrow: z.string().trim().max(80).optional(),
  processTitle: z.string().trim().max(160).optional(),
  processDescription: z.string().trim().max(320).optional(),
  processStepsJson: safeJsonArray(processStepSchema),

  // FAQ
  faqEyebrow: z.string().trim().max(80).optional(),
  faqTitle: z.string().trim().max(160).optional(),
  faqsJson: safeJsonArray(faqSchema),

  // Intros
  servicesEyebrow: z.string().trim().max(80).optional(),
  servicesTitle: z.string().trim().max(160).optional(),
  servicesDescription: z.string().trim().max(320).optional(),

  solutionsEyebrow: z.string().trim().max(80).optional(),
  solutionsTitle: z.string().trim().max(160).optional(),
  solutionsDescription: z.string().trim().max(320).optional(),

  projectsEyebrow: z.string().trim().max(80).optional(),
  projectsTitle: z.string().trim().max(160).optional(),
  projectsDescription: z.string().trim().max(320).optional(),

  industriesEyebrow: z.string().trim().max(80).optional(),
  industriesTitle: z.string().trim().max(160).optional(),
  industriesDescription: z.string().trim().max(320).optional(),

  testimonialsEyebrow: z.string().trim().max(80).optional(),
  testimonialsTitle: z.string().trim().max(160).optional(),
  testimonialsDescription: z.string().trim().max(320).optional(),

  insightsEyebrow: z.string().trim().max(80).optional(),
  insightsTitle: z.string().trim().max(160).optional(),
  insightsDescription: z.string().trim().max(320).optional(),

  // CTA
  ctaTitle: z.string().trim().max(160).optional(),
  ctaDescription: z.string().trim().max(320).optional(),
  ctaPrimaryLabel: z.string().trim().max(40).optional(),
  ctaPrimaryUrl: z.string().trim().max(200).optional(),
  ctaSecondaryLabel: z.string().trim().max(40).optional(),
  ctaSecondaryUrl: z.string().trim().max(200).optional(),

  // SEO
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
});
