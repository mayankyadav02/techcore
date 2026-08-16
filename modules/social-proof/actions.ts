"use server";

import { runAdminAction } from "@/lib/admin/action";
import { parseForm } from "@/lib/admin/parse";
import { formChecked, formString } from "@/lib/admin/query";
import { testimonialInputSchema } from "@/modules/social-proof/admin.schema";
import {
  createTestimonial,
  deleteTestimonial,
  setTestimonialStatus,
  updateTestimonial,
} from "@/modules/social-proof/admin.service";

function payload(formData: FormData) {
  const rating = formString(formData.get("rating"));
  return parseForm(testimonialInputSchema, {
    quote: formString(formData.get("quote")),
    authorName: formString(formData.get("authorName")),
    authorRole: formString(formData.get("authorRole")),
    company: formString(formData.get("company")),
    rating: rating ? Number(rating) : undefined,
    status: formString(formData.get("status")),
    featured: formChecked(formData.get("featured")),
    sortOrder: Number(formString(formData.get("sortOrder")) || "0"),
  });
}

export async function createTestimonialAction(formData: FormData) {
  return runAdminAction(async () => {
    const data = await createTestimonial(payload(formData));
    return { ok: true as const, message: "Testimonial created.", data };
  });
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const data = await updateTestimonial(id, payload(formData));
    return { ok: true as const, message: "Testimonial saved.", data };
  });
}

export async function publishTestimonialAction(id: string, publish: boolean) {
  return runAdminAction(async () => {
    await setTestimonialStatus(id, publish ? "published" : "draft");
    return {
      ok: true as const,
      message: publish ? "Testimonial published." : "Testimonial unpublished.",
    };
  });
}

export async function deleteTestimonialAction(id: string) {
  return runAdminAction(async () => {
    await deleteTestimonial(id);
    return { ok: true as const, message: "Testimonial deleted." };
  });
}
