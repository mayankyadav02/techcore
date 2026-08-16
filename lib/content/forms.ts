import { z } from "zod";
import {
  applicationApiSchema,
  budgetValues,
  contactApiSchema,
  enquiryApiSchema,
  timelineValues,
} from "@/modules/leads/schema";

export { budgetValues, timelineValues };

export const contactSchema = contactApiSchema;
export const quoteSchema = enquiryApiSchema;
export const applicationSchema = applicationApiSchema;

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const budgetLabels: Record<(typeof budgetValues)[number], string> = {
  "under-50k": "Under $50k",
  "50-150k": "$50k – $150k",
  "150-400k": "$150k – $400k",
  "400k-plus": "$400k+",
  undecided: "Not sure yet",
};

export const timelineLabels: Record<(typeof timelineValues)[number], string> = {
  asap: "As soon as possible",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  exploratory: "Exploratory",
};
