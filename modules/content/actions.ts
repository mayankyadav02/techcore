"use server";

import { runAdminAction } from "@/lib/admin/action";
import { parseForm } from "@/lib/admin/parse";
import { formString } from "@/lib/admin/query";
import { settingsInputSchema } from "@/modules/content/admin.schema";
import { updateSettingsAdmin } from "@/modules/content/admin.service";

export async function updateSettingsAction(formData: FormData) {
  return runAdminAction(async () => {
    await updateSettingsAdmin(
      parseForm(settingsInputSchema, {
        companyName: formString(formData.get("companyName")),
        tagline: formString(formData.get("tagline")),
        contactEmail: formString(formData.get("contactEmail")),
        contactPhone: formString(formData.get("contactPhone")),
        address: formString(formData.get("address")),
        linkedin: formString(formData.get("linkedin")),
        x: formString(formData.get("x")),
        footerText: formString(formData.get("footerText")),
        seoTitle: formString(formData.get("seoTitle")),
        seoDescription: formString(formData.get("seoDescription")),
      }),
    );
    return { ok: true as const, message: "Settings saved." };
  });
}
