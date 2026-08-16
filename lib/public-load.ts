import { isAppError } from "@/lib/errors";

/** Runtime catalogue load. Returns [] if Mongo is down — never demo content as live. */
export async function loadListOrEmpty<T>(load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load();
  } catch {
    return [];
  }
}

/** Runtime detail load. Missing/unavailable documents are empty, not static demos. */
export async function loadOneOrEmpty<T>(load: () => Promise<T>): Promise<T | undefined> {
  try {
    return await load();
  } catch (error) {
    if (isAppError(error) && error.code === "NOT_FOUND") {
      return undefined;
    }
    return undefined;
  }
}

/** @deprecated Use loadListOrEmpty for runtime requests. */
export async function loadListOrFallback<T>(
  load: () => Promise<T[]>,
  _fallback: T[],
): Promise<T[]> {
  void _fallback;
  return loadListOrEmpty(load);
}

/** @deprecated Use loadOneOrEmpty for runtime requests. */
export async function loadOneOrFallback<T>(
  load: () => Promise<T>,
  _fallback: () => T | undefined,
): Promise<T | undefined> {
  void _fallback;
  return loadOneOrEmpty(load);
}

export async function staticParamsFrom(
  load: () => Promise<{ slug: string }[]>,
  fallback: { slug: string }[],
): Promise<{ slug: string }[]> {
  try {
    const rows = await load();
    if (rows.length > 0) {
      return rows.map((row) => ({ slug: row.slug }));
    }
  } catch {
    // Build-time Mongo may be unavailable.
  }
  return fallback.map((row) => ({ slug: row.slug }));
}
