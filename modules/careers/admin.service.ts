import { revalidatePath } from "next/cache";
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
import { Job } from "@/modules/careers/job.model";
import { Application } from "@/modules/careers/application.model";
import { canTransitionApplication } from "@/lib/status-flow";
import type { ApplicationStatus } from "@/modules/shared/enums";
import type { z } from "zod";
import type { jobInputSchema } from "@/modules/careers/admin.schema";
import type {
  applicationNoteSchema,
  applicationStatusSchema,
} from "@/modules/careers/application-admin.schema";

const notDeleted = { deletedAt: null };

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

function revalidateJobs() {
  revalidatePublic(
    [cacheTags.jobs],
    ["/", "/careers", "/careers/[slug]", "/admin/careers", "/admin/applications"],
  );
}

export async function listJobs(input: { q?: string; status?: string; page?: string }) {
  await requirePermission("content:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["title", "slug", "department", "location"]));
  if (input.status) filter.status = input.status;
  const query = filter as never;
  const [rows, total] = await Promise.all([
    Job.find(query)
      .select(
        "title slug status department location employmentType applicationsCount updatedAt",
      )
      .sort({ updatedAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Job.countDocuments(query),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getJobAdmin(id: string) {
  await requirePermission("content:read");
  await connectMongo();
  const row = await Job.findOne({ _id: parseObjectId(id), ...notDeleted }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Role not found.");
  return mapRow(row);
}

export async function createJob(input: z.infer<typeof jobInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "open") await requirePermission("content:publish");
  await connectMongo();
  const slug = ensureSlug(input.title, input.slug);
  try {
    const created = await Job.create({
      ...input,
      slug,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await writeAuditLog({
      actorId: user.id,
      action: "job.create",
      resourceType: "Job",
      resourceId: String(created._id),
    });
    revalidateJobs();
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

export async function updateJob(id: string, input: z.infer<typeof jobInputSchema>) {
  const user = await requirePermission("content:write");
  if (input.status === "open") await requirePermission("content:publish");
  await connectMongo();
  const existing = await Job.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!existing) throw new AppError("NOT_FOUND", "Role not found.");
  const slug = ensureSlug(input.title, input.slug);
  try {
    existing.set({ ...input, slug, updatedBy: user.id });
    await existing.save();
    revalidateJobs();
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

export async function setJobActive(id: string, active: boolean) {
  const user = await requirePermission("content:publish");
  await connectMongo();
  const row = await Job.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Role not found.");
  row.status = active ? "open" : "closed";
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidateJobs();
}

export async function deleteJob(id: string) {
  const user = await requirePermission("content:write");
  await connectMongo();
  const row = await Job.findOne({ _id: parseObjectId(id), ...notDeleted });
  if (!row) throw new AppError("NOT_FOUND", "Role not found.");
  row.deletedAt = new Date();
  row.status = "archived";
  row.updatedBy = user.id as unknown as typeof row.updatedBy;
  await row.save();
  revalidateJobs();
}

export async function listApplications(input: {
  q?: string;
  status?: string;
  jobId?: string;
  page?: string;
}) {
  await requirePermission("leads:read");
  await connectMongo();
  const page = parsePage(input.page);
  const filter: Record<string, unknown> = { ...notDeleted };
  Object.assign(filter, searchFilter(input.q, ["name", "email", "jobTitleSnapshot"]));
  if (input.status) filter.status = input.status;
  if (input.jobId) filter.jobId = parseObjectId(input.jobId);
  const query = filter as never;
  const [rows, total] = await Promise.all([
    Application.find(query)
      .select("name email jobTitleSnapshot jobId status createdAt resumeAssetId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    Application.countDocuments(query),
  ]);
  return {
    rows: rows.map(mapRow),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getApplication(id: string) {
  await requirePermission("leads:read");
  await connectMongo();
  const row = await Application.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  }).lean();
  if (!row) throw new AppError("NOT_FOUND", "Application not found.");
  return mapRow(row);
}

export async function setApplicationStatus(
  id: string,
  input: z.infer<typeof applicationStatusSchema>,
) {
  const user = await requirePermission("leads:write");
  await connectMongo();
  const row = await Application.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Application not found.");
  if (
    !canTransitionApplication(
      row.status as ApplicationStatus,
      input.status as ApplicationStatus,
    )
  ) {
    throw new AppError("VALIDATION_ERROR", "That status change is not allowed.", {
      fields: { status: "That status change is not allowed" },
    });
  }
  row.status = input.status;
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "application.status",
    resourceType: "Application",
    resourceId: id,
    metadata: { status: input.status },
  });
  revalidatePath("/admin/applications");
}

export async function addApplicationNote(
  id: string,
  input: z.infer<typeof applicationNoteSchema>,
) {
  const user = await requirePermission("leads:write");
  await connectMongo();
  const row = await Application.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Application not found.");
  row.notes.push({ body: input.body, authorId: user.id as never, createdAt: new Date() });
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "application.note",
    resourceType: "Application",
    resourceId: id,
  });
  revalidatePath("/admin/applications");
}

export async function deleteApplication(id: string) {
  const user = await requirePermission("leads:write");
  await connectMongo();
  const row = await Application.findOne({
    _id: parseObjectId(id),
    ...notDeleted,
  });
  if (!row) throw new AppError("NOT_FOUND", "Application not found.");
  row.deletedAt = new Date();
  await row.save();
  await writeAuditLog({
    actorId: user.id,
    action: "application.delete",
    resourceType: "Application",
    resourceId: id,
  });
  revalidatePath("/admin/applications");
}
