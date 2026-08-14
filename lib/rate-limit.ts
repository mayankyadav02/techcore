export type RateLimitResult = {
  success: boolean;
  remaining: number;
};

/**
 * Placeholder used by public forms and login in later phases.
 * In-memory limiting is not safe across serverless instances.
 */
export async function rateLimit(key: string): Promise<RateLimitResult> {
  void key;
  return { success: true, remaining: 100 };
}
