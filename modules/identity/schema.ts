import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-constants";

export const loginApiSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Enter your password")
    .max(200),
});

export const adminPasswordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters`)
  .max(200);
