import { connectMongo } from "@/lib/db";
import { Enquiry } from "@/modules/leads/enquiry.model";
import { writeAuditLog } from "@/lib/audit";
import { opaqueRecordId } from "@/lib/api/ids";
import { findPublishedServiceBySlug } from "@/modules/catalog/public.service";
import { AppError } from "@/lib/errors";
import {
  sendContactEnquiryEmails,
  sendQuoteEnquiryEmails,
} from "@/modules/notifications/email.service";
import type { z } from "zod";
import type { contactApiSchema, enquiryApiSchema } from "@/modules/leads/schema";

export async function createContactEnquiry(
  input: z.infer<typeof contactApiSchema>,
) {
  if (input.website) {
    return { id: opaqueRecordId() };
  }

  await connectMongo();
  const created = await Enquiry.create({
    type: "contact",
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    company: input.company || undefined,
    subject: input.subject,
    message: input.message,
    status: "new",
    sourcePage: input.sourcePage || "/contact",
    gdprConsent: true,
  });

  await writeAuditLog({
    action: "enquiry.create",
    resourceType: "Enquiry",
    resourceId: String(created._id),
    metadata: { type: "contact" },
  });

  await sendContactEnquiryEmails({
    customerName: input.name,
    customerEmail: input.email,
    subject: input.subject,
    message: input.message,
  });

  return { id: String(created._id) };
}

export async function createQuoteEnquiry(
  input: z.infer<typeof enquiryApiSchema>,
) {
  if (input.website) {
    return { id: opaqueRecordId() };
  }

  const service = await findPublishedServiceBySlug(input.service);
  if (!service) {
    throw new AppError("VALIDATION_ERROR", "Select a valid service.", {
      fields: { service: "Select a valid service" },
    });
  }

  await connectMongo();
  const created = await Enquiry.create({
    type: "quote",
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    company: input.company,
    message: input.description,
    serviceInterestIds: [service._id],
    budgetRange: input.budget,
    timeline: input.timeline,
    status: "new",
    sourcePage: input.sourcePage || "/quote",
    gdprConsent: true,
  });

  await writeAuditLog({
    action: "enquiry.create",
    resourceType: "Enquiry",
    resourceId: String(created._id),
    metadata: { type: "quote" },
  });

  await sendQuoteEnquiryEmails({
    customerName: input.name,
    customerEmail: input.email,
    company: input.company,
    serviceName: service.title,
    budgetRange: input.budget,
    timeline: input.timeline,
  });

  return { id: String(created._id) };
}
