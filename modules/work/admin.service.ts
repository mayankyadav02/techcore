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
import { Project } from "@/modules/work/project.model";
import type { contentStatuses } from "@/modules/shared/enums";
import type { z } from "zod";
import type { projectInputSchema } from "@/modules/catalog/admin.schema";

const notDeleted = { deletedAt: null };
type ContentStatus = (typeof contentStatuses)[number];

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
    [cacheTags.projects],
    ["/", "/projects", "/projects/[slug]", "/admin/projects"],
  );
}

export async function listProjects(input: {
  q?: string;
  status?: string;
  featured?: string;
  page?: string;
}) {
  await requirePermission("content:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["title", "slug", "sector", "clientName"]));
  if (input.status) filter.status = input.status;
  if (input.featured === "true") filter.featured = true;
  if (input.featured === "false") filter.featured = false;
  const query = filter as never;
  const [rows, total] = await Promise.all([
    Project.find(query)
      .select("title slug status featured year sector updatedAt")
      .sort({ sortOrder: 1, year: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Project.countDocuments(query),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getProject(id: string) {
  await requirePermission("content:read");
  await connectMongo();
  const row = await Project.findOne({ _id: parseObjectId(id), ...notDeleted }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Project not found.");
  return mapRow(row);
}

export async function createProject(input: z.infer<typeof projectInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  try {
    const created = await Project.create({
      ...input,
      slug,
      publishedAt: input.status === "published" ? new Date() : undefined,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await writeAuditLog({
      actorId: user.id,
      action: "project.create",
      resourceType: "Project",
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

export async function updateProject(
  id: string,
  input: z.infer<typeof projectInputSchema>,
) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const existing = await Project.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!existing) throw new AppError("NOT_FOUND", "Project not found.");
  const slug = ensureSlug(input.title, input.slug);
  try {
    existing.set({
      ...input,
      slug,
      publishedAt:
        input.status === "published"
          ? existing.publishedAt ?? new Date()
          : existing.publishedAt,
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

export async function toggleProjectFeatured(id: string) {
  const user = await requirePermission("content:write");
  await connectMongo();
  const row = await Project.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Project not found.");
  row.featured = !row.featured;
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidate();
  return { featured: row.featured };
}

export async function setProjectStatus(id: string, status: ContentStatus) {
  const user = await requirePermission("content:publish");
  await connectMongo();
  const row = await Project.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Project not found.");
  row.status = status;
  if (status === "published" && !row.publishedAt) row.publishedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidate();
}

export async function deleteProject(id: string) {
  const user = await requirePermission("content:write");
  await connectMongo();
  const row = await Project.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Project not found.");
  row.deletedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidate();
}
