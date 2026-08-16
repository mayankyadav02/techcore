import { cacheTags, revalidatePublic } from "@/lib/cache-tags";
import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { requirePermission } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { parseObjectId } from "@/lib/api/ids";
import {
  ADMIN_PAGE_SIZE,
  parsePage,
  searchFilter,
} from "@/lib/admin/query";
import { Testimonial } from "@/modules/social-proof/testimonial.model";
import type { contentStatuses } from "@/modules/shared/enums";
import type { z } from "zod";
import type { testimonialInputSchema } from "@/modules/social-proof/admin.schema";

const notDeleted = { deletedAt: null };
type ContentStatus = (typeof contentStatuses)[number];

function mapRow<T extends { _id: unknown }>(row: T) {
  const { _id, ...rest } = row;
  return { id: String(_id), ...rest };
}

function revalidate() {
  revalidatePublic([cacheTags.testimonials], ["/", "/admin/testimonials"]);
}

export async function listTestimonials(input: {
  q?: string;
  status?: string;
  page?: string;
}) {
  await requirePermission("testimonials:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["authorName", "company", "quote"]));
  if (input.status) filter.status = input.status;
  const query = filter as never;
  const [rows, total] = await Promise.all([
    Testimonial.find(query)
      .select("authorName company status featured sortOrder updatedAt")
      .sort({ sortOrder: 1, updatedAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Testimonial.countDocuments(query),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getTestimonial(id: string) {
  await requirePermission("testimonials:read");
  await connectMongo();
  const row = await Testimonial.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found.");
  return mapRow(row);
}

export async function createTestimonial(
  input: z.infer<typeof testimonialInputSchema>,
) {
  const user = await requirePermission("testimonials:write");
  await connectMongo();
  const created = await Testimonial.create({
    ...input,
    createdBy: user.id,
    updatedBy: user.id,
  });
  await writeAuditLog({
    actorId: user.id,
    action: "testimonial.create",
    resourceType: "Testimonial",
    resourceId: String(created._id),
  });
  revalidate();
  return { id: String(created._id) };
}

export async function updateTestimonial(
  id: string,
  input: z.infer<typeof testimonialInputSchema>,
) {
  const user = await requirePermission("testimonials:write");
  await connectMongo();
  const existing = await Testimonial.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!existing) throw new AppError("NOT_FOUND", "Testimonial not found.");
  existing.set({ ...input, updatedBy: user.id });
  await existing.save();
  revalidate();
  return { id };
}

export async function setTestimonialStatus(id: string, status: ContentStatus) {
  const user = await requirePermission("testimonials:write");
  await connectMongo();
  const row = await Testimonial.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found.");
  row.status = status;
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidate();
}

export async function deleteTestimonial(id: string) {
  const user = await requirePermission("testimonials:write");
  await connectMongo();
  const row = await Testimonial.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found.");
  row.deletedAt = new Date();
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidate();
}
