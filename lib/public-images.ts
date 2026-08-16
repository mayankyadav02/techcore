import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const IMAGE_EXT = /\.(avif|jpe?g|png|webp)$/i;
const CATALOG_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"] as const;

type CatalogKind = "solutions" | "industries" | "home" | "services";

const SLUG_ALIASES: Record<CatalogKind, Record<string, string[]>> = {
  solutions: {
    "e-commerce": ["ecommerce"],
    ecommerce: ["e-commerce"],
    finance: ["fintech"],
    fintech: ["finance"],
    "real-estate": ["enterprise"],
    enterprise: ["real-estate"],
  },
  industries: {
    retail: ["ecommerce", "e-commerce"],
    "e-commerce": ["ecommerce", "retail"],
    ecommerce: ["e-commerce", "retail"],
    startups: ["technology"],
    technology: ["startups"],
  },
  home: {},
  services: {},
};

function publicAbs(...parts: string[]) {
  return join(process.cwd(), "public", ...parts);
}

export function publicAssetIfExists(pathname: string): string | null {
  const rel = pathname.replace(/^\/+/, "").replaceAll("\\", "/");
  try {
    return existsSync(publicAbs(...rel.split("/"))) ? `/${rel}` : null;
  } catch {
    return null;
  }
}

export function firstPublicImage(candidates: string[]): string | null {
  for (const candidate of candidates) {
    const found = publicAssetIfExists(candidate);
    if (found) return found;
  }
  return null;
}

export function listPublicImages(dir: string): string[] {
  const rel = dir.replace(/^\/+/, "").replaceAll("\\", "/");
  try {
    const abs = publicAbs(...rel.split("/"));
    if (!existsSync(abs)) return [];
    return readdirSync(abs)
      .filter((name) => IMAGE_EXT.test(name))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => `/${rel}/${name}`);
  } catch {
    return [];
  }
}

function slugNames(kind: CatalogKind, slug: string): string[] {
  const key = slug.trim().toLowerCase();
  return [...new Set([key, ...(SLUG_ALIASES[kind][key] ?? [])])];
}

export function catalogImage(kind: CatalogKind, slug: string): string | null {
  const names = slugNames(kind, slug);
  return firstPublicImage(
    names.flatMap((name) =>
      [`images/${kind}`, kind].flatMap((dir) =>
        CATALOG_EXTS.map((ext) => `${dir}/${name}${ext}`),
      ),
    ),
  );
}
