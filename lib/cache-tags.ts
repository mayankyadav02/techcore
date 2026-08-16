import { revalidatePath, revalidateTag } from "next/cache";

export const cacheTags = {
  services: "services",
  solutions: "solutions",
  industries: "industries",
  projects: "projects",
  posts: "posts",
  jobs: "jobs",
  settings: "settings",
  testimonials: "testimonials",
} as const;

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags];

export function revalidatePublic(
  tags: CacheTag[],
  paths: string[] = [],
) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
  for (const path of paths) {
    if (path.includes("[")) {
      revalidatePath(path, "page");
    } else {
      revalidatePath(path);
    }
    if (path === "/") {
      revalidatePath("/", "layout");
    }
  }
}
