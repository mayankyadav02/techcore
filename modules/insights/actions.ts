"use server";

import { runAdminAction } from "@/lib/admin/action";
import { parseForm } from "@/lib/admin/parse";
import { formChecked, formString, splitLines } from "@/lib/admin/query";
import { blogInputSchema } from "@/modules/insights/admin.schema";
import {
  createPost,
  deletePost,
  setPostStatus,
  updatePost,
} from "@/modules/insights/admin.service";

function payload(formData: FormData) {
  return parseForm(blogInputSchema, {
    title: formString(formData.get("title")),
    slug: formString(formData.get("slug")),
    excerpt: formString(formData.get("excerpt")),
    body: formString(formData.get("body")),
    authorName: formString(formData.get("authorName")),
    category: formString(formData.get("category")),
    tags: splitLines(formData.get("tags")).flatMap((line) =>
      line.split(",").map((tag) => tag.trim()).filter(Boolean),
    ),
    heroImageUrl: formString(formData.get("heroImageUrl")),
    readTime: formString(formData.get("readTime")),
    status: formString(formData.get("status")),
    featured: formChecked(formData.get("featured")),
    publishedAt: formString(formData.get("publishedAt")),
  });
}

export async function createPostAction(formData: FormData) {
  return runAdminAction(async () => {
    const data = await createPost(payload(formData));
    return { ok: true as const, message: "Post created.", data };
  });
}

export async function updatePostAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const data = await updatePost(id, payload(formData));
    return { ok: true as const, message: "Post saved.", data };
  });
}

export async function setPostStatusAction(id: string, publish: boolean) {
  return runAdminAction(async () => {
    await setPostStatus(id, publish ? "published" : "draft");
    return {
      ok: true as const,
      message: publish ? "Post published." : "Returned to draft.",
    };
  });
}

export async function deletePostAction(id: string) {
  return runAdminAction(async () => {
    await deletePost(id);
    return { ok: true as const, message: "Post deleted." };
  });
}
