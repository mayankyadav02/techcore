import { AppError } from "@/lib/errors";
import { connectMongo } from "@/lib/db";
import { RateLimit } from "@/modules/shared/rate-limit.model";

const WINDOW_MS = 15 * 60 * 1000;

const limits: Record<string, number> = {
  contact: 8,
  enquiry: 8,
  apply: 5,
  login: 10,
  forgot_password: 3,
  reset_password: 5,
  test_email: 3,
};

/**
 * Distributed rate limiter using MongoDB. Safe for Vercel/serverless environments.
 * Uses a fixed absolute window approach to prevent race conditions.
 */
export async function rateLimit(key: string): Promise<{
  success: boolean;
  remaining: number;
}> {
  const route = key.split(":")[0] ?? "contact";
  const max = limits[route] ?? 10;

  const windowId = Math.floor(Date.now() / WINDOW_MS);
  const windowKey = `${key}:${windowId}`;

  try {
    await connectMongo();
    const doc = await RateLimit.findOneAndUpdate(
      { key: windowKey },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date(Date.now() + WINDOW_MS * 2) }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (doc.count > max) {
      return { success: false, remaining: 0 };
    }

    return { success: true, remaining: max - doc.count };
  } catch (error) {
    // If the database is unreachable, we fail-closed for abuse endpoints
    // to prevent attacks taking down the database from bypassing rate limits.
    // We throw INTERNAL_ERROR so it generates a 500 cleanly.
    throw new AppError("INTERNAL_ERROR", "Unable to verify rate limit.");
  }
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

export async function clearRateLimitsForTesting(keyPrefix?: string) {
  if (process.env.NODE_ENV === "test") {
    await connectMongo();
    if (keyPrefix) {
      await RateLimit.deleteMany({ key: new RegExp(keyPrefix) });
    } else {
      await RateLimit.deleteMany({});
    }
  }
}
