import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { isObjectId, parseObjectId, parseSlug } from "@/lib/api/ids";
import { Job } from "@/modules/careers/job.model";
import { Application } from "@/modules/careers/application.model";
import { writeAuditLog } from "@/lib/audit";
import { openJobFilter } from "@/modules/careers/public.service";
import { sendApplicationEmails } from "@/modules/notifications/email.service";
import type { z } from "zod";
import type { applicationApiSchema } from "@/modules/leads/schema";

function jobQuery(idOrSlug: string) {
  if (isObjectId(idOrSlug)) {
    return { _id: parseObjectId(idOrSlug), ...openJobFilter() };
  }
  return { slug: parseSlug(idOrSlug), ...openJobFilter() };
}

export async function createApplication(
  idOrSlug: string,
  input: z.infer<typeof applicationApiSchema>,
) {
  const query = jobQuery(idOrSlug);
  await connectMongo();
  const job = await Job.findOne(query);
  if (!job) throw new AppError("NOT_FOUND", "This role is not open.");
  if (job.closesAt && job.closesAt.getTime() <= Date.now()) {
    throw new AppError("NOT_FOUND", "This role is not open.");
  }

  const duplicate = await Application.findOne({
    jobId: job._id,
    email: input.email.toLowerCase(),
    status: { $in: ["new", "reviewing", "shortlisted"] },
    deletedAt: null,
  }).lean();

  if (duplicate) {
    throw new AppError(
      "CONFLICT",
      "An application for this role is already on file for that email.",
    );
  }

  const created = await Application.create({
    jobId: job._id,
    jobTitleSnapshot: job.title,
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    coverLetter: input.coverLetter,
    status: "new",
    source: "careers_page",
    gdprConsent: true,
  });

  await Job.updateOne({ _id: job._id }, { $inc: { applicationsCount: 1 } });
  await writeAuditLog({
    action: "application.create",
    resourceType: "Application",
    resourceId: String(created._id),
  });

  await sendApplicationEmails({
    applicantName: input.name,
    applicantEmail: input.email,
    jobTitle: job.title,
  });

  return { id: String(created._id) };
}
