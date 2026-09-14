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
        logoId: formString(formData.get("logoId")),
        logoType: formString(formData.get("logoType")),
        logoText: formString(formData.get("logoText")),
        navigationJson: formString(formData.get("navigationJson")),
        ctaLabel: formString(formData.get("ctaLabel")),
        ctaUrl: formString(formData.get("ctaUrl")),
        footerGroupsJson: formString(formData.get("footerGroupsJson")),
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

export async function updateHomepageAction(formData: FormData) {
  return runAdminAction(async () => {
    // Dynamically import the service and schema to avoid circular dependencies if any
    const { updateHomepageAdmin } = await import("@/modules/content/admin.service");
    const { homeInputSchema } = await import("@/modules/content/home.schema");
    
    // Process form data into a plain object of strings
    const payload = Object.fromEntries(formData.entries());
    
    await updateHomepageAdmin(parseForm(homeInputSchema, payload));
    return { ok: true as const, message: "Homepage content saved." };
  });
}

export async function updateAboutAction(formData: FormData) {
  return runAdminAction(async () => {
    const { updateAboutAdmin } = await import("@/modules/content/admin.service");
    const { aboutInputSchema } = await import("@/modules/content/about.schema");
    
    const payload = Object.fromEntries(formData.entries());
    
    await updateAboutAdmin(parseForm(aboutInputSchema, payload));
    return { ok: true as const, message: "About content saved." };
  });
}

export async function updatePageSeoAction(formData: FormData) {
  return runAdminAction(async () => {
    const { updatePageSeoAdmin } = await import("@/modules/content/admin.service");
    const { pageSeoInputSchema } = await import("@/modules/content/page-seo.schema");
    
    const payload = Object.fromEntries(formData.entries());
    
    await updatePageSeoAdmin(parseForm(pageSeoInputSchema, payload));
    return { ok: true as const, message: "Page SEO saved." };
  });
}
