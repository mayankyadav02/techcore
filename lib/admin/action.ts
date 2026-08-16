import { isAppError } from "@/lib/errors";

export type ActionResult<T = unknown> =
  | { ok: true; message?: string; data?: T }
  | {
      ok: false;
      code: string;
      message: string;
      fields?: Record<string, string>;
    };

export async function runAdminAction<T>(
  work: () => Promise<{ ok: true; message?: string; data?: T }>,
): Promise<ActionResult<T>> {
  try {
    return await work();
  } catch (error) {
    if (isAppError(error)) {
      return {
        ok: false,
        code: error.code,
        message: error.message,
        fields: error.fields,
      };
    }
    console.error(
      JSON.stringify({
        level: "error",
        code: "INTERNAL_ERROR",
        name: error instanceof Error ? error.name : "Error",
      }),
    );
    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
    };
  }
}

export function isDuplicateKey(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000,
  );
}
