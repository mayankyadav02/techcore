/** Shared with the Edge proxy — keep this file free of Node-only imports. */
export const SESSION_COOKIE = "tc_session";
export const SESSION_ABSOLUTE_MS = 12 * 60 * 60 * 1000;
export const SESSION_IDLE_MS = 8 * 60 * 60 * 1000;
export const LOGIN_LOCK_ATTEMPTS = 5;
export const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;
export const BCRYPT_COST = 12;
export const MIN_PASSWORD_LENGTH = 12;

export function safeCallbackUrl(value: string | null | undefined) {
  if (!value) return "/admin/dashboard";
  if (!value.startsWith("/admin")) return "/admin/dashboard";
  if (value.startsWith("//") || value.includes("\\")) return "/admin/dashboard";
  if (value.startsWith("/admin/login")) return "/admin/dashboard";
  if (value.includes("://")) return "/admin/dashboard";
  return value;
}
