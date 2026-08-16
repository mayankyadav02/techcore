import { AppError } from "@/lib/errors";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;

const limits: Record<string, number> = {
  contact: 8,
  enquiry: 8,
  apply: 5,
  login: 10,
};

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * In-memory limiter. Safe for a single Node process; not shared across
 * serverless instances. Replace with Redis when the platform is clustered.
 */
export async function rateLimit(key: string): Promise<{
  success: boolean;
  remaining: number;
}> {
  const now = Date.now();
  prune(now);
  const route = key.split(":")[0] ?? "contact";
  const max = limits[route] ?? 10;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: max - 1 };
  }

  if (current.count >= max) {
    return { success: false, remaining: 0 };
  }

  current.count += 1;
  return { success: true, remaining: max - current.count };
}

export async function enforceRateLimit(route: string, client: string) {
  const result = await rateLimit(`${route}:${client}`);
  if (!result.success) {
    throw new AppError(
      "RATE_LIMITED",
      "Too many requests. Please wait before trying again.",
    );
  }
}
