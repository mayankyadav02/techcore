import { z } from "zod";
import { userRoles, userStatuses } from "@/modules/shared/enums";
import { adminPasswordSchema } from "@/modules/identity/schema";

export const userInputSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address")
    .max(254, "Email is too long")
    .toLowerCase(),
  name: z
    .string()
    .min(1, "Enter a name")
    .max(80, "Name is too long")
    .trim(),
  password: adminPasswordSchema,
  role: z.enum(userRoles as unknown as [string, ...string[]]),
});

export const userUpdateSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address")
    .max(254, "Email is too long")
    .toLowerCase(),
  name: z
    .string()
    .min(1, "Enter a name")
    .max(80, "Name is too long")
    .trim(),
  role: z.enum(userRoles as unknown as [string, ...string[]]),
  status: z.enum(userStatuses as unknown as [string, ...string[]]),
});

export const userStatusSchema = z.object({
  status: z.enum(userStatuses as unknown as [string, ...string[]]),
});
