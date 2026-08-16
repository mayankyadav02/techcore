import { cacheTags, revalidatePublic } from "@/lib/cache-tags";
import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { requirePermission } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { parseObjectId } from "@/lib/api/ids";
import { isDuplicateKey } from "@/lib/admin/action";
import {
  ADMIN_PAGE_SIZE,
  parsePage,
  searchFilter,
  slugify,
} from "@/lib/admin/query";
import { BlogPost } from "@/modules/insights/blog-post.model";
import type { blogStatuses } from "@/modules/shared/enums";
import type { z } from "zod";
import type { blogInputSchema } from "@/modules/insights/admin.schema";

const notDeleted = { deletedAt: null };
type BlogStatus = (typeof blogStatuses)[number];

function mapRow<T extends { _id: unknown }>(row: T) {
  const { _id, ...rest } = row;
  return { id: String(_id), ...rest };
}

function ensureSlug(title: string, slug: string) {
  const value = slug || slugify(title);
  if (!value) {
    throw new AppError("VALIDATION_ERROR", "Add a title or slug.", {
      fields: { slug: "Add a title or slug" },
    });
  }
  return value;
}

function revalidate() {
  revalidatePublic(
    [cacheTags.posts],
    ["/", "/blog", "/blog/[slug]", "/admin/blog"],
  );
}

function publishedAtFrom(input: string | undefined, status: BlogStatus, existing?: Date) {
  if (input) {
    const date = new Date(input);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (status === "published") return existing ?? new Date();
  return existing;
}

export async function listPosts(input: {
  q?: string;
  status?: string;
  category?: string;
  page?: string;
}) {
  await requirePermission("content:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["title", "slug", "excerpt", "category"]));
  if (input.status) filter.status = input.status;
  if (input.category) filter.category = input.category;
  const query = filter as never;
  const [rows, total, categories] = await Promise.all([
    BlogPost.find(query)
      .select("title slug status category featured publishedAt updatedAt")
      .sort({ publishedAt: -1, updatedAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    BlogPost.countDocuments(query),
    BlogPost.distinct("category", notDeleted),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
    categories: categories.filter(Boolean).sort(),
  };
}

export async function getPost(id: string) {
  await requirePermission("content:read");
  await connectMongo();
  const row = await BlogPost.findOne({ _id: parseObjectId(id), ...notDeleted }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Post not found.");
  return mapRow(row);
}

export async function createPost(input: z.infer<typeof blogInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  try {
    const created = await BlogPost.create({
      ...input,
      slug,
      publishedAt: publishedAtFrom(input.publishedAt, input.status),
      createdBy: user.id,
      updatedBy: user.id,
    });
    await writeAuditLog({
      actorId: user.id,
      action: "post.create",
      resourceType: "BlogPost",
      resourceId: String(created._id),
    });
    revalidate();
    return { id: String(created._id) };
  } catch (error) {
    if (isDuplicateKey(error)) {
      throw new AppError("CONFLICT", "That slug is already in use.", {
        fields: { slug: "That slug is already in use" },
      });
    }
    throw error;
  }
}

export async function updatePost(id: string, input: z.infer<typeof blogInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const existing = await BlogPost.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!existing) throw new AppError("NOT_FOUND", "Post not found.");
  const slug = ensureSlug(input.title, input.slug);
  try {
    existing.set({
      ...input,
      slug,
      publishedAt: publishedAtFrom(input.publishedAt, input.status, existing.publishedAt ?? undefined),
      updatedBy: user.id,
    });
    await existing.save();
    revalidate();
    return { id };
  } catch (error) {
    if (isDuplicateKey(error)) {
      throw new AppError("CONFLICT", "That slug is already in use.", {
        fields: { slug: "That slug is already in use" },
      });
    }
    throw error;
  }
}

export async function setPostStatus(id: string, status: BlogStatus) {
  const user = await requirePermission("content:publish");
  await connectMongo();
  const row = await BlogPost.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Post not found.");
  row.status = status;
  if (status === "published" && !row.publishedAt) row.publishedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidate();
}

export async function deletePost(id: string) {
  const user = await requirePermission("content:write");
  await connectMongo();
  const row = await BlogPost.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Post not found.");
  row.deletedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidate();
}
