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
import { Service } from "@/modules/catalog/service.model";
import { Solution } from "@/modules/catalog/solution.model";
import { Industry } from "@/modules/catalog/industry.model";
import type { contentStatuses } from "@/modules/shared/enums";
import type { z } from "zod";
import type {
  industryInputSchema,
  serviceInputSchema,
  solutionInputSchema,
} from "@/modules/catalog/admin.schema";

const notDeleted = { deletedAt: null };

type ContentStatus = (typeof contentStatuses)[number];

function mapRow<T extends { _id: unknown; deletedAt?: unknown }>(row: T) {
  const { _id, deletedAt: _deletedAt, ...rest } = row;
  void _deletedAt;
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

function revalidateCatalog() {
  revalidatePublic(
    [cacheTags.services, cacheTags.solutions, cacheTags.industries],
    [
      "/",
      "/services",
      "/services/[slug]",
      "/solutions",
      "/solutions/[slug]",
      "/industries",
      "/industries/[slug]",
      "/quote",
      "/about",
      "/admin/services",
      "/admin/solutions",
      "/admin/industries",
    ],
  );
}

export async function listServices(input: {
  q?: string;
  status?: string;
  page?: string;
}) {
  await requirePermission("content:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["title", "slug", "summary"]));
  if (input.status) filter.status = input.status;
  const [rows, total] = await Promise.all([
    Service.find(filter as never)
      .select("title slug status featured sortOrder updatedAt")
      .sort({ sortOrder: 1, title: 1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Service.countDocuments(filter as never),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getService(id: string) {
  await requirePermission("content:read");
  await connectMongo();
  const row = await Service.findOne({ _id: parseObjectId(id), ...notDeleted }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Service not found.");
  return mapRow(row);
}

export async function createService(input: z.infer<typeof serviceInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "published") {
    await requirePermission("content:publish");
  }
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  try {
    const created = await Service.create({
      ...input,
      slug,
      publishedAt: input.status === "published" ? new Date() : undefined,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await writeAuditLog({
      actorId: user.id,
      action: "service.create",
      resourceType: "Service",
      resourceId: String(created._id),
    });
    revalidateCatalog();
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

export async function updateService(
  id: string,
  input: z.infer<typeof serviceInputSchema>,
) {
  const user = await requirePermission("content:write");
  if (input.status === "published") {
    await requirePermission("content:publish");
  }
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  const existing = await Service.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!existing) throw new AppError("NOT_FOUND", "Service not found.");
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
    await writeAuditLog({
      actorId: user.id,
      action: "service.update",
      resourceType: "Service",
      resourceId: id,
    });
    revalidateCatalog();
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

export async function setServiceStatus(id: string, status: ContentStatus) {
  const user = await requirePermission("content:publish");
  await connectMongo();
  const row = await Service.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Service not found.");
  row.status = status;
  if (status === "published" && !row.publishedAt) row.publishedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "service.status",
    resourceType: "Service",
    resourceId: id,
    metadata: { status },
  });
  revalidateCatalog();
}

export async function deleteService(id: string) {
  const user = await requirePermission("content:write");
  await connectMongo();
  const row = await Service.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Service not found.");
  row.deletedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "service.delete",
    resourceType: "Service",
    resourceId: id,
  });
  revalidateCatalog();
}

export async function listSolutions(input: {
  q?: string;
  status?: string;
  page?: string;
}) {
  await requirePermission("content:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["title", "slug", "summary"]));
  if (input.status) filter.status = input.status;
  const [rows, total] = await Promise.all([
    Solution.find(filter as never)
      .select("title slug status featured sortOrder updatedAt")
      .sort({ sortOrder: 1, title: 1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Solution.countDocuments(filter as never),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getSolution(id: string) {
  await requirePermission("content:read");
  await connectMongo();
  const row = await Solution.findOne({ _id: parseObjectId(id), ...notDeleted }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Solution not found.");
  return mapRow(row);
}

export async function createSolution(input: z.infer<typeof solutionInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  try {
    const created = await Solution.create({
      ...input,
      slug,
      publishedAt: input.status === "published" ? new Date() : undefined,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await writeAuditLog({
      actorId: user.id,
      action: "solution.create",
      resourceType: "Solution",
      resourceId: String(created._id),
    });
    revalidateCatalog();
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

export async function updateSolution(
  id: string,
  input: z.infer<typeof solutionInputSchema>,
) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  const existing = await Solution.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!existing) throw new AppError("NOT_FOUND", "Solution not found.");
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
    await writeAuditLog({
      actorId: user.id,
      action: "solution.update",
      resourceType: "Solution",
      resourceId: id,
    });
    revalidateCatalog();
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

export async function setSolutionStatus(id: string, status: ContentStatus) {
  const user = await requirePermission("content:publish");
  await connectMongo();
  const row = await Solution.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Solution not found.");
  row.status = status;
  if (status === "published" && !row.publishedAt) row.publishedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidateCatalog();
}

export async function deleteSolution(id: string) {
  const user = await requirePermission("content:write");
  await connectMongo();
  const row = await Solution.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Solution not found.");
  row.deletedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidateCatalog();
}

export async function listIndustries(input: {
  q?: string;
  status?: string;
  page?: string;
}) {
  await requirePermission("content:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["title", "slug", "summary"]));
  if (input.status) filter.status = input.status;
  const [rows, total] = await Promise.all([
    Industry.find(filter as never)
      .select("title slug status featured sortOrder updatedAt")
      .sort({ sortOrder: 1, title: 1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Industry.countDocuments(filter as never),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getIndustry(id: string) {
  await requirePermission("content:read");
  await connectMongo();
  const row = await Industry.findOne({ _id: parseObjectId(id), ...notDeleted }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Industry not found.");
  return mapRow(row);
}

export async function createIndustry(input: z.infer<typeof industryInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  try {
    const created = await Industry.create({
      ...input,
      slug,
      publishedAt: input.status === "published" ? new Date() : undefined,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await writeAuditLog({
      actorId: user.id,
      action: "industry.create",
      resourceType: "Industry",
      resourceId: String(created._id),
    });
    revalidateCatalog();
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

export async function updateIndustry(
  id: string,
  input: z.infer<typeof industryInputSchema>,
) {
  const user = await requirePermission("content:write");
  if (input.status === "published") await requirePermission("content:publish");
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  const existing = await Industry.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!existing) throw new AppError("NOT_FOUND", "Industry not found.");
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
    await writeAuditLog({
      actorId: user.id,
      action: "industry.update",
      resourceType: "Industry",
      resourceId: id,
    });
    revalidateCatalog();
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

export async function setIndustryStatus(id: string, status: ContentStatus) {
  const user = await requirePermission("content:publish");
  await connectMongo();
  const row = await Industry.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Industry not found.");
  row.status = status;
  if (status === "published" && !row.publishedAt) row.publishedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "industry.status",
    resourceType: "Industry",
    resourceId: id,
    metadata: { status },
  });
  revalidateCatalog();
}

export async function deleteIndustry(id: string) {
  const user = await requirePermission("content:write");
  await connectMongo();
  const row = await Industry.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Industry not found.");
  row.deletedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "industry.delete",
    resourceType: "Industry",
    resourceId: id,
  });
  revalidateCatalog();
}
