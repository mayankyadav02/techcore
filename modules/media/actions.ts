"use server";

import { mediaUpdateSchema, type MediaUpdateInput } from "@/modules/media/media.schema";
import { updateMediaAdmin, listMediaAdmin } from "@/modules/media/admin.service";
import { getSession } from "@/lib/auth";
import { cacheTags, revalidatePublic } from "@/lib/cache-tags";

export async function listMediaAction(query?: string, page?: number, limit?: number) {
  try {
    const user = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };
    const result = await listMediaAdmin(query, page, limit);
    return { success: true, ...result };
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

export async function uploadMediaAction(formData: FormData) {
  try {
    const user = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };

    const { hasPermission } = await import("@/lib/rbac");
    if (!hasPermission(user.role, "site:write")) {
      return { success: false, error: "Permission denied" };
    }

    const file = formData.get("file") as File | null;
    if (!file) return { success: false, error: "No file provided" };

    const { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, validateImageContent } = await import("@/lib/file-validation");

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File exceeds 4MB limit" };
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: "Unsupported MIME type" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!(await validateImageContent(buffer))) {
      return { success: false, error: "Invalid file content/signature" };
    }

    const { put, del } = await import("@vercel/blob");
    const { uploadMediaAdmin } = await import("@/modules/media/admin.service");

    const ext = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || "bin";
    const uniqueName = `media/${crypto.randomUUID()}.${ext}`;

    let blob: { url: string };
    if (process.env.NODE_ENV === "test" || process.env.BLOB_READ_WRITE_TOKEN === "test-token") {
      blob = { url: `https://test.public.blob.vercel-storage.com/${uniqueName}` };
    } else {
      blob = await put(uniqueName, buffer, {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: false, // already using UUID
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    }

    try {
      const result = await uploadMediaAdmin({
        filename: file.name,
        url: blob.url,
        mimeType: file.type,
        sizeBytes: file.size,
        userId: user.id,
      });

      const { revalidatePublic, cacheTags } = await import("@/lib/cache-tags");
      if (process.env.BLOB_READ_WRITE_TOKEN !== "test-token") {
        revalidatePublic([cacheTags.media]);
      }
      return { success: true, item: result };
    } catch (err: any) {
      // Rollback blob on DB failure
      await del(blob.url).catch(() => {});
      console.error("Media DB insertion error:", err);
      return { success: false, error: "Failed to save media record" };
    }
  } catch (err: any) {
    console.error("uploadMediaAction error:", err);
    return { success: false, error: "Upload failed" };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    const user = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };

    const { deleteMediaAdmin } = await import("@/modules/media/admin.service");
    await deleteMediaAdmin(id, user.id);

    const { revalidatePublic, cacheTags } = await import("@/lib/cache-tags");
    if (process.env.BLOB_READ_WRITE_TOKEN !== "test-token") {
      revalidatePublic([cacheTags.media]);
    }

    return { success: true };
  } catch (err: any) {
    console.error("deleteMediaAction error:", err);
    return { success: false, error: err.message || "Failed to delete media" };
  }
}
