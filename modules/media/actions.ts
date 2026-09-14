"use server";

import { mediaUpdateSchema, type MediaUpdateInput } from "@/modules/media/media.schema";
import { updateMediaAdmin, listMediaAdmin } from "@/modules/media/admin.service";
import { getSession } from "@/lib/auth";
import { cacheTags, revalidatePublic } from "@/lib/cache-tags";

export async function listMediaAction(query?: string) {
  try {
    const user = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };
    const items = await listMediaAdmin(query);
    return { success: true, items };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateMediaAction(input: MediaUpdateInput) {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = mediaUpdateSchema.parse(input);
    await updateMediaAdmin(validated, user.id);
    
    // Invalidate media tag and any content that might depend on it (e.g. homepage, company)
    revalidatePublic([
      cacheTags.media,
      cacheTags.settings,
      cacheTags.homepage,
      cacheTags.about,
      cacheTags.posts,
      cacheTags.projects,
      cacheTags.industries,
      cacheTags.services,
      cacheTags.solutions,
    ]);

    return { success: true };
  } catch (err: any) {
    console.error("updateMediaAction error:", err);
    return { success: false, error: err.message || "Failed to update media" };
  }
}
