import { z } from "zod";
import { applicationStatuses } from "@/modules/shared/enums";

export const applicationStatusSchema = z.object({
  status: z.enum(applicationStatuses),
});

export const applicationNoteSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});
