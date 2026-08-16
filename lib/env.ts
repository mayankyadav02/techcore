import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === undefined ? undefined : value;

const LOCAL_APP_URL = "http://localhost:3000";
const LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/techcore";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    MONGODB_URI: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    AUTH_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    APP_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  })
  .superRefine((data, ctx) => {
    const isProductionBuild =
      process.env.NEXT_PHASE === "phase-production-build";
    if (data.NODE_ENV !== "production" || isProductionBuild) return;
    if (!data.MONGODB_URI) {
      ctx.addIssue({
        code: "custom",
        path: ["MONGODB_URI"],
        message: "MONGODB_URI is required in production",
      });
    }
    if (!data.AUTH_SECRET || data.AUTH_SECRET.length < 32) {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_SECRET"],
        message: "AUTH_SECRET must be at least 32 characters in production",
      });
    }
    if (!data.APP_URL) {
      ctx.addIssue({
        code: "custom",
        path: ["APP_URL"],
        message: "APP_URL is required in production",
      });
    }
  })
  .transform((data) => ({
    ...data,
    APP_URL: (data.APP_URL ?? LOCAL_APP_URL).replace(/\/$/, ""),
    MONGODB_URI:
      data.MONGODB_URI ??
      (data.NODE_ENV === "production" ? undefined : LOCAL_MONGODB_URI),
  }));

export type Env = z.infer<typeof envSchema>;

function readEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH_SECRET: process.env.AUTH_SECRET,
    APP_URL: process.env.APP_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")}`,
    );
  }

  return parsed.data;
}

export const env = readEnv();
