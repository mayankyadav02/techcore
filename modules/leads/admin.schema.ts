import { z } from "zod";
import { enquiryStatuses } from "@/modules/shared/enums";

export const enquiryStatusSchema = z.object({
  status: z.enum(enquiryStatuses),
});

export const enquiryNoteSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});
