import { cacheTags, revalidatePublic } from "@/lib/cache-tags";
import { clearPublicSettingsCache } from "@/modules/content/public.service";
import { connectMongo } from "@/lib/db";
import { requireAnyPermission } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";
import { Settings } from "@/modules/content/settings.model";
import { HomeContent } from "@/modules/content/home.model";
import { AboutContent } from "@/modules/content/about.model";
import { site } from "@/lib/site";
import type { z } from "zod";
import type { settingsInputSchema } from "@/modules/content/admin.schema";
import type { homeInputSchema } from "@/modules/content/home.schema";
import type { aboutInputSchema } from "@/modules/content/about.schema";
export async function getSettingsAdmin() {
  await requireAnyPermission(["settings:read", "site:write"]);
  await connectMongo();
  const row = await Settings.findOne({ key: "global" }).lean();
  if (!row) {
    return {
      companyName: site.name,
      tagline: site.tagline,
      contactEmail: site.email,
      contactPhone: site.phone,
      address: site.address,
      logoType: "image",
      logoText: site.name,
      navigation: [],
      ctaLabel: "",
      ctaUrl: "",
      footerGroups: [],
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
    logoType: row.logoType ?? "image",
    logoText: row.logoText ?? row.companyName,
    navigation: row.navigation ?? [],
    ctaLabel: row.ctaLabel ?? "",
    ctaUrl: row.ctaUrl ?? "",
    footerGroups: row.footerGroups ?? [],
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
  const user = await requireAnyPermission(["settings:write", "site:write"]);
  const canWriteSettings = hasPermission(user.role, "settings:write");
  const canWriteSite = hasPermission(user.role, "site:write");
  
  await connectMongo();
  
  const updateObj: Record<string, unknown> = {
    updatedBy: user.id,
  };
  
  if (canWriteSite) {
    updateObj.companyName = input.companyName;
    updateObj.tagline = input.tagline;
    updateObj.contactEmail = input.contactEmail;
    updateObj.contactPhone = input.contactPhone;
    updateObj.address = input.address;
    updateObj.logoType = input.logoType;
    updateObj.logoText = input.logoText;
    updateObj.navigation = input.navigationJson;
    updateObj.ctaLabel = input.ctaLabel;
    updateObj.ctaUrl = input.ctaUrl;
    updateObj.footerGroups = input.footerGroupsJson;
    updateObj["socialLinks.linkedin"] = input.linkedin;
    updateObj["socialLinks.x"] = input.x;
    updateObj.footerText = input.footerText;
  }
  
  if (canWriteSettings) {
    updateObj["defaultSeo.title"] = input.seoTitle;
    updateObj["defaultSeo.description"] = input.seoDescription;
  }

  await Settings.findOneAndUpdate(
    { key: "global" },
    { $set: updateObj },
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

export async function getHomepageAdmin() {
  await requireAnyPermission(["site:write"]);
  await connectMongo();
  const row = await HomeContent.findOne({ key: "home" }).lean();
  if (!row) {
    return null;
  }
  return row;
}

export async function updateHomepageAdmin(
  input: z.infer<typeof homeInputSchema>,
) {
  const user = await requireAnyPermission(["site:write"]);
  
  await connectMongo();
  
  const updateObj: Record<string, unknown> = {
    updatedBy: user.id,
    ...input,
  };

  // Convert array JSON strings back to parsed arrays if they were stringified for the update?
  // Wait, `input` already has `packagesJson` mapped to parsed arrays if we used `.transform` in Zod.
  // Oh, wait, in Zod we mapped it to `packagesJson`. Let's rename the keys in `updateObj` so they match the schema.
  updateObj.packages = input.packagesJson;
  delete updateObj.packagesJson;

  updateObj.reasons = input.reasonsJson;
  delete updateObj.reasonsJson;

  updateObj.processSteps = input.processStepsJson;
  delete updateObj.processStepsJson;

  updateObj.faqs = input.faqsJson;
  delete updateObj.faqsJson;

  await HomeContent.findOneAndUpdate(
    { key: "home" },
    { $set: updateObj },
    { upsert: true, setDefaultsOnInsert: true },
  );
  
  await writeAuditLog({
    actorId: user.id,
    action: "homepage.update",
    resourceType: "HomeContent",
    resourceId: "home",
  });
  
  revalidatePublic(
    [cacheTags.homepage, cacheTags.about],
    ["/", "/about", "/admin/settings/homepage"],
  );
}

export async function getAboutAdmin() {
  await requireAnyPermission(["site:write"]);
  await connectMongo();
  const row = await AboutContent.findOne({ key: "about" }).lean();
  if (!row) {
    return null;
  }
  return row;
}

export async function updateAboutAdmin(
  input: z.infer<typeof aboutInputSchema>,
) {
  const user = await requireAnyPermission(["site:write"]);
  
  await connectMongo();
  
  const updateObj: Record<string, unknown> = {
    updatedBy: user.id,
    ...input,
  };

  updateObj.values = input.valuesJson;
  delete updateObj.valuesJson;

  updateObj.faqs = input.faqsJson;
  delete updateObj.faqsJson;

  await AboutContent.findOneAndUpdate(
    { key: "about" },
    { $set: updateObj },
    { upsert: true, setDefaultsOnInsert: true },
  );
  
  await writeAuditLog({
    actorId: user.id,
    action: "about.update",
    resourceType: "AboutContent",
    resourceId: "about",
  });
  
  revalidatePublic(
    [cacheTags.about],
    ["/about", "/admin/settings/about"],
  );
}
