import { z } from "zod";
import { employmentTypes, jobStatuses, slugPattern } from "@/modules/shared/enums";

export const jobInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .max(80)
    .refine((value) => value === "" || slugPattern.test(value), "Use a lowercase slug"),
  department: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120),
  employmentType: z.enum(employmentTypes),
  experience: z.string().trim().max(40).optional(),
  description: z.string().trim().min(20).max(8000),
  requirements: z.string().trim().max(8000).optional(),
  benefits: z.string().trim().max(4000).optional(),
  responsibilities: z.array(z.string().trim().min(1).max(240)).max(30),
  skills: z.array(z.string().trim().min(1).max(80)).max(30),
  status: z.enum(jobStatuses),
});
