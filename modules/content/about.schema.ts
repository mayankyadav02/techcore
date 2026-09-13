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
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid JSON array",
        });
        return z.NEVER;
      }
    })
    .pipe(z.array(schema));

const valueSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(320),
});

const faqSchema = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(1000),
});

export const aboutInputSchema = z.object({
  // Hero
  heroEyebrow: z.string().trim().max(80).optional(),
  heroTitle: z.string().trim().max(160).optional(),
  heroDescription: z.string().trim().max(320).optional(),
  heroPrimaryLabel: z.string().trim().max(40).optional(),
  heroPrimaryUrl: z.string().trim().max(200).optional(),
  heroSecondaryLabel: z.string().trim().max(40).optional(),
  heroSecondaryUrl: z.string().trim().max(200).optional(),

  // Story
  storyEyebrow: z.string().trim().max(80).optional(),
  storyTitle: z.string().trim().max(160).optional(),
  storyDescription: z.string().trim().max(320).optional(),
  storyBody: z.string().trim().max(1000).optional(),

  // Mission & Vision
  missionTitle: z.string().trim().max(160).optional(),
  missionBody: z.string().trim().max(1000).optional(),
  visionTitle: z.string().trim().max(160).optional(),
  visionBody: z.string().trim().max(1000).optional(),

  // Values
  valuesEyebrow: z.string().trim().max(80).optional(),
  valuesTitle: z.string().trim().max(160).optional(),
  valuesJson: safeJsonArray(valueSchema),

  // Expertise (Services Intro)
  expertiseEyebrow: z.string().trim().max(80).optional(),
  expertiseTitle: z.string().trim().max(160).optional(),

  // Approach
  approachEyebrow: z.string().trim().max(80).optional(),
  approachTitle: z.string().trim().max(160).optional(),
  approachDescription: z.string().trim().max(320).optional(),

  // Why TechCore (Expectations Intro)
  expectationsEyebrow: z.string().trim().max(80).optional(),
  expectationsTitle: z.string().trim().max(160).optional(),

  // FAQ
  faqEyebrow: z.string().trim().max(80).optional(),
  faqTitle: z.string().trim().max(160).optional(),
  faqsJson: safeJsonArray(faqSchema),

  // CTA
  ctaTitle: z.string().trim().max(160).optional(),
  ctaDescription: z.string().trim().max(320).optional(),
  ctaPrimaryLabel: z.string().trim().max(40).optional(),
  ctaPrimaryUrl: z.string().trim().max(200).optional(),
  ctaSecondaryLabel: z.string().trim().max(40).optional(),
  ctaSecondaryUrl: z.string().trim().max(200).optional(),
});
