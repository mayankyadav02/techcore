import { revalidatePath } from "next/cache";
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
import { Enquiry } from "@/modules/leads/enquiry.model";
import { canTransitionEnquiry } from "@/lib/status-flow";
import type { enquiryStatuses } from "@/modules/shared/enums";
import type { z } from "zod";
import type { enquiryNoteSchema, enquiryStatusSchema } from "@/modules/leads/admin.schema";

type EnquiryStatus = (typeof enquiryStatuses)[number];

const notDeleted = { deletedAt: null };

function mapRow<T extends { _id: unknown }>(row: T) {
  const { _id, ...rest } = row;
  return { id: String(_id), ...rest };
}

export async function listEnquiries(input: {
  q?: string;
  status?: string;
  type?: string;
  page?: string;
}) {
  await requirePermission("leads:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["name", "email", "company", "subject"]));
  if (input.status) filter.status = input.status;
  if (input.type) filter.type = input.type;
  const query = filter as never;
  const [rows, total] = await Promise.all([
    Enquiry.find(query)
      .select("name email company type status subject createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Enquiry.countDocuments(query),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getEnquiry(id: string) {
  await requirePermission("leads:read");
  await connectMongo();
  const row = await Enquiry.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Enquiry not found.");
  return mapRow(row);
}

export async function setEnquiryStatus(
  id: string,
  input: z.infer<typeof enquiryStatusSchema>,
) {
  const user = await requirePermission("leads:write");
  await connectMongo();
  const row = await Enquiry.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Enquiry not found.");
  const next = input.status as EnquiryStatus;
  if (!canTransitionEnquiry(row.status as EnquiryStatus, next)) {
    throw new AppError("VALIDATION_ERROR", "That status change is not allowed.", {
      fields: { status: "That status change is not allowed" },
    });
  }
  row.status = next;
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "enquiry.status",
    resourceType: "Enquiry",
    resourceId: id,
    metadata: { status: input.status },
  });
  revalidatePath("/admin/enquiries");
}

export async function addEnquiryNote(
  id: string,
  input: z.infer<typeof enquiryNoteSchema>,
) {
  const user = await requirePermission("leads:write");
  await connectMongo();
  const row = await Enquiry.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Enquiry not found.");
  row.notes.push({ body: input.body, authorId: user.id as never, createdAt: new Date() });
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "enquiry.note",
    resourceType: "Enquiry",
    resourceId: id,
  });
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiry(id: string) {
  const user = await requirePermission("leads:write");
  await connectMongo();
  const row = await Enquiry.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Enquiry not found.");
  row.deletedAt = new Date();
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "enquiry.delete",
    resourceType: "Enquiry",
    resourceId: id,
  });
  revalidatePath("/admin/enquiries");
}
