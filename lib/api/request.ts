import type { ZodType } from "zod";
import { AppError } from "@/lib/errors";
import { validationError } from "@/lib/api/http";
import { env } from "@/lib/env";

const JSON_LIMIT = 100 * 1024;
const MULTIPART_LIMIT = 6 * 1024 * 1024;

export function assertContentLength(request: Request, maxBytes: number) {
  const header = request.headers.get("content-length");
  if (!header) return;
  const size = Number(header);
  if (Number.isFinite(size) && size > maxBytes) {
    throw new AppError("VALIDATION_ERROR", "Request is too large.");
  }
}

function isLoopbackHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function defaultPort(protocol: string) {
  return protocol === "https:" ? "443" : "80";
}

function isAllowedOrigin(origin: string, expectedOrigin: string) {
  if (origin === expectedOrigin) return true;
  if (env.NODE_ENV === "production") return false;

  try {
    const actual = new URL(origin);
    const expected = new URL(expectedOrigin);
    const actualPort = actual.port || defaultPort(actual.protocol);
    const expectedPort = expected.port || defaultPort(expected.protocol);
    return (
      actual.protocol === expected.protocol &&
      actualPort === expectedPort &&
      isLoopbackHostname(actual.hostname) &&
      isLoopbackHostname(expected.hostname)
    );
  } catch {
    return false;
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  const expected = new URL(request.url).origin;

  if (origin) {
    if (!isAllowedOrigin(origin, expected)) {
      throw new AppError("FORBIDDEN", "Invalid request origin.");
    }
    return;
  }

  if (site === "same-origin" || site === "none") return;

  if (env.NODE_ENV === "production") {
    throw new AppError("FORBIDDEN", "Invalid request origin.");
  }
}

export async function readJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  assertContentLength(request, JSON_LIMIT);
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new AppError("VALIDATION_ERROR", "JSON body is required.");
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    throw new AppError("VALIDATION_ERROR", "Invalid JSON body.");
  }

  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("VALIDATION_ERROR", "Invalid request body.");
  }

  return parseSchema(schema, payload);
}

export function parseSchema<T>(schema: ZodType<T>, payload: unknown): T {
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

export async function readFormData(request: Request) {
  assertContentLength(request, MULTIPART_LIMIT);
  try {
    return await request.formData();
  } catch {
    throw new AppError("VALIDATION_ERROR", "Invalid form data.");
  }
}

export function clientKey(request: Request) {
  if (env.NODE_ENV !== "production") return "local";
  // Use the first forwarded hop only when this process sits behind a proxy
  // that overwrites the header. Spoofed values are not treated as trusted identity.
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("x-real-ip")?.trim() ||
    forwarded?.split(",")[0]?.trim() ||
    "unknown";
  return ip.slice(0, 128);
}
