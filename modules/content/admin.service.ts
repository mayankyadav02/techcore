import { cacheTags, revalidatePublic } from "@/lib/cache-tags";
import { clearPublicSettingsCache } from "@/modules/content/public.service";
import { connectMongo } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { Settings } from "@/modules/content/settings.model";
import { site } from "@/lib/site";
import type { z } from "zod";
import type { settingsInputSchema } from "@/modules/content/admin.schema";

export async function getSettingsAdmin() {
  await requirePermission("settings:read");
  await connectMongo();
  const row = await Settings.findOne({ key: "global" }).lean();
  if (!row) {
    return {
      companyName: site.name,
      tagline: site.tagline,
      contactEmail: site.email,
      contactPhone: site.phone,
      address: site.address,
      linkedin: "",
      x: "",
      footerText: "",
      seoTitle: "",
      seoDescription: "",
    };
  }
  return {
    companyName: row.companyName,
    tagline: row.tagline ?? "",
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone ?? "",
    address: row.address ?? "",
    linkedin: row.socialLinks?.linkedin ?? "",
    x: row.socialLinks?.x ?? "",
    footerText: row.footerText ?? "",
    seoTitle: row.defaultSeo?.title ?? "",
    seoDescription: row.defaultSeo?.description ?? "",
  };
}

export async function updateSettingsAdmin(
  input: z.infer<typeof settingsInputSchema>,
) {
  const user = await requirePermission("settings:write");
  await connectMongo();
  await Settings.findOneAndUpdate(
    { key: "global" },
    {
      companyName: input.companyName,
      tagline: input.tagline,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      address: input.address,
      footerText: input.footerText,
      socialLinks: { linkedin: input.linkedin, x: input.x },
      defaultSeo: {
        title: input.seoTitle,
        description: input.seoDescription,
      },
      updatedBy: user.id,
    },
    { upsert: true, setDefaultsOnInsert: true },
  );
  await writeAuditLog({
    actorId: user.id,
    action: "settings.update",
    resourceType: "Settings",
    resourceId: "global",
  });
  clearPublicSettingsCache();
  revalidatePublic(
    [cacheTags.settings],
    ["/", "/contact", "/admin/settings"],
  );
}
