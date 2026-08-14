export type PublishStatus = "draft" | "published" | "archived";

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: string;
      message?: string;
      fields?: Record<string, string>;
    };
