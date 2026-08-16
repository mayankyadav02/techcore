"use server";

import { runAdminAction } from "@/lib/admin/action";
import { parseForm } from "@/lib/admin/parse";
import { formString } from "@/lib/admin/query";
import { enquiryNoteSchema, enquiryStatusSchema } from "@/modules/leads/admin.schema";
import { addEnquiryNote, deleteEnquiry, setEnquiryStatus } from "@/modules/leads/admin.service";

export async function setEnquiryStatusAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    await setEnquiryStatus(
      id,
      parseForm(enquiryStatusSchema, {
        status: formString(formData.get("status")),
      }),
    );
    return { ok: true as const, message: "Enquiry status updated." };
  });
}

export async function addEnquiryNoteAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    await addEnquiryNote(
      id,
      parseForm(enquiryNoteSchema, {
        body: formString(formData.get("body")),
      }),
    );
    return { ok: true as const, message: "Note added." };
  });
}

export async function deleteEnquiryAction(id: string) {
  return runAdminAction(async () => {
    await deleteEnquiry(id);
    return { ok: true as const, message: "Enquiry deleted." };
  });
}
