import { z } from "zod";
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const mediaUpdateSchema = z.object({
  id: objectIdSchema,
  altText: z.string().trim().max(320).optional(),
});

export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>;
