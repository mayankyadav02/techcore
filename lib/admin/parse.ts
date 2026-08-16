import { z, type ZodType } from "zod";
import { validationError } from "@/lib/api/http";

export function parseForm<T>(schema: ZodType<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    throw validationError(fields);
  }
  return parsed.data;
}

export const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "Enter a valid http(s) URL",
  );
