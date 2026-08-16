export const ADMIN_PAGE_SIZE = 20;

export function parsePage(value: string | undefined) {
  const parsed = Number(value ?? 1);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return Math.min(parsed, 500);
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function searchFilter(query: string | undefined, fields: string[]) {
  const term = query?.trim().slice(0, 80);
  if (!term) return {};
  const pattern = new RegExp(escapeRegex(term), "i");
  return { $or: fields.map((field) => ({ [field]: pattern })) };
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug;
}

export function splitLines(value: FormDataEntryValue | null, max = 40) {
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function formString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export function formChecked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

export function isoDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : "";
}

export function displayDate(value: unknown) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}
