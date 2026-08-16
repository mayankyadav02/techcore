import { z } from "zod";
import { slugPattern } from "@/modules/shared/enums";

export const budgetValues = [
  "under-50k",
  "50-150k",
  "150-400k",
  "400k-plus",
  "undecided",
] as const;

export const timelineValues = [
  "asap",
  "1-3-months",
  "3-6-months",
  "exploratory",
] as const;


export const phoneSchema = z
  .string()
  .trim()
  .max(40)
  .refine(
    (value) => value === "" || /^[+]?[\d\s().-]{7,20}$/.test(value),
    "Enter a valid phone number",
  );

export const honeypotSchema = z.string().max(200).optional().or(z.literal(""));

export const contactApiSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.email("Enter a valid email"),
  phone: phoneSchema.optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Enter a subject").max(120),
  message: z.string().trim().min(20, "Please add a little more detail").max(5000),
  gdprConsent: z
    .boolean()
    .refine((value) => value === true, "Consent is required"),
  website: honeypotSchema,
  sourcePage: z.string().trim().max(200).optional(),
});

export const enquiryApiSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.email("Enter a valid email"),
  phone: phoneSchema.optional().or(z.literal("")),
  company: z.string().trim().min(2, "Enter a company name").max(120),
  service: z.string().regex(slugPattern, "Select a service").max(80),
  budget: z.enum(budgetValues, { message: "Select a budget range" }),
  timeline: z.enum(timelineValues, { message: "Select a timeline" }),
  description: z.string().trim().min(20, "Describe the project briefly").max(5000),
  gdprConsent: z
    .boolean()
    .refine((value) => value === true, "Consent is required"),
  website: honeypotSchema,
  sourcePage: z.string().trim().max(200).optional(),
});

export const applicationApiSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.email("Enter a valid email"),
  phone: phoneSchema.optional().or(z.literal("")),
  coverLetter: z.string().trim().min(20, "Add a short cover note").max(8000),
  gdprConsent: z
    .boolean()
    .refine((value) => value === true, "Consent is required"),
  website: honeypotSchema,
});
