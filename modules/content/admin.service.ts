import { cacheTags, revalidatePublic } from "@/lib/cache-tags";
import { clearPublicSettingsCache } from "@/modules/content/public.service";
import { connectMongo } from "@/lib/db";
import { requireAnyPermission } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { Settings } from "@/modules/content/settings.model";
import { writeAuditLog } from "@/lib/audit";
import { PageContent } from "@/modules/content/page-content.model";
import { LegalPage } from "@/modules/content/legal-page.model";
import { pageContentSchema } from "@/modules/content/page-content.schema";
import { legalPageSchema } from "@/modules/content/legal-page.schema";
import { HomeContent } from "@/modules/content/home.model";
import { AboutContent } from "@/modules/content/about.model";
import { site } from "@/lib/site";
import type { z } from "zod";
import type { settingsInputSchema } from "@/modules/content/admin.schema";
import type { homeInputSchema } from "@/modules/content/home.schema";
import type { aboutInputSchema } from "@/modules/content/about.schema";
import type { pageSeoInputSchema } from "@/modules/content/page-seo.schema";
import { PageSeo } from "@/modules/content/page-seo.model";
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
      themeBrand: "",
      themeBrandDark: "",
      themeBrandLight: "",
      themeRadius: "",
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
    themeBrand: (row as any).theme?.brand ?? "",
    themeBrandDark: (row as any).theme?.brandDark ?? "",
    themeBrandLight: (row as any).theme?.brandLight ?? "",
    themeRadius: (row as any).theme?.radius ?? "",
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
    
    if (input.logoId) {
      const { Media } = await import("@/modules/media/media.model");
      const exists = await Media.exists({ _id: input.logoId });
      if (!exists) {
        throw new Error("Validation Error: The selected logo media does not exist.");
      }
      updateObj.logoId = input.logoId;
    } else if (input.logoId === "") {
      updateObj.logoId = null;
    }

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

    if (input.themeBrand) updateObj["theme.brand"] = input.themeBrand;
    if (input.themeBrandDark) updateObj["theme.brandDark"] = input.themeBrandDark;
    if (input.themeBrandLight) updateObj["theme.brandLight"] = input.themeBrandLight;
    if (input.themeRadius) updateObj["theme.radius"] = input.themeRadius;
  }

  const updateDoc: any = { $set: updateObj };
  const unsetObj: Record<string, 1> = {};

  if (canWriteSettings) {
    if (input.themeBrand === "") unsetObj["theme.brand"] = 1;
    if (input.themeBrandDark === "") unsetObj["theme.brandDark"] = 1;
    if (input.themeBrandLight === "") unsetObj["theme.brandLight"] = 1;
    if (input.themeRadius === "") unsetObj["theme.radius"] = 1;
  }

  if (Object.keys(unsetObj).length > 0) {
    updateDoc.$unset = unsetObj;
  }

  await Settings.findOneAndUpdate(
    { key: "global" },
    updateDoc,
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

  if (input.seoTitle !== undefined || input.seoDescription !== undefined) {
    updateObj["seo.title"] = input.seoTitle;
    updateObj["seo.description"] = input.seoDescription;
  }
  delete updateObj.seoTitle;
  delete updateObj.seoDescription;

  const { Media } = await import("@/modules/media/media.model");
  
  if (input.aboutImageId) {
    const exists = await Media.exists({ _id: input.aboutImageId });
    if (!exists) {
      throw new Error("Validation Error: The selected about media does not exist.");
    }
  }

  if (input.heroImageIds && input.heroImageIds.length > 0) {
    const uniqueIds = Array.from(new Set(input.heroImageIds.filter(Boolean)));
    if (uniqueIds.length > 0) {
      const count = await Media.countDocuments({ _id: { $in: uniqueIds } });
      if (count !== uniqueIds.length) {
        throw new Error("Validation Error: One or more selected hero media do not exist.");
      }
    }
  }

  if (input.heroImageIds) {
    updateObj.heroImageIds = input.heroImageIds.filter(Boolean);
  }

  if (input.aboutImageId === "") {
    updateObj.aboutImageId = null;
  }

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
    ["/", "/about", "/admin/settings"],
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

  if (input.seoTitle !== undefined || input.seoDescription !== undefined) {
    updateObj["seo.title"] = input.seoTitle;
    updateObj["seo.description"] = input.seoDescription;
  }
  delete updateObj.seoTitle;
  delete updateObj.seoDescription;

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

export async function listPageSeoAdmin() {
  await requireAnyPermission(["site:write"]);
  await connectMongo();
  const rows = await PageSeo.find().lean();
  return rows;
}

export async function updatePageSeoAdmin(
  input: z.infer<typeof pageSeoInputSchema>,
) {
  const user = await requireAnyPermission(["site:write"]);
  
  await connectMongo();
  
  const updateObj: Record<string, unknown> = {
    updatedBy: user.id,
  };

  if (input.seoTitle !== undefined || input.seoDescription !== undefined) {
    updateObj["seo.title"] = input.seoTitle;
    updateObj["seo.description"] = input.seoDescription;
  }

  await PageSeo.findOneAndUpdate(
    { page: input.page },
    { $set: updateObj },
    { upsert: true, setDefaultsOnInsert: true },
  );
  
  await writeAuditLog({
    actorId: user.id,
    action: "pageseo.update",
    resourceType: "PageSeo",
    resourceId: input.page,
  });
  
  revalidatePublic(
    [cacheTags.pageSeo],
    [`/${input.page}`, "/admin/settings/page-seo"],
  );
}

// Page Content (shared hero/content) admin functions
export async function getPageContentAdmin(key: string) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();
  const row = await PageContent.findOne({ key } as any).lean();
  if (!row) return null;
  return row;
}

export async function updatePageContentAdmin(input: z.infer<typeof pageContentSchema>) {
  const user = await requireAnyPermission(["site:write"]);
  await connectMongo();
  const updateObj = { updatedBy: user.id, ...input };
  await PageContent.findOneAndUpdate({ key: input.key }, { $set: updateObj }, { upsert: true, setDefaultsOnInsert: true });
  await writeAuditLog({
    actorId: user.id,
    action: "page_content.update",
    resourceType: "PageContent",
    resourceId: input.key,
  });
  revalidatePublic([cacheTags.pageContent], [`/${input.key}`, "/admin/settings/page-content"]);
}

// Legal Page admin functions
export async function getLegalPageAdmin(key: string) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();
  const row = await LegalPage.findOne({ key } as any).lean();
  if (!row) return null;
  return row;
}

export async function updateLegalPageAdmin(input: z.infer<typeof legalPageSchema>) {
  const user = await requireAnyPermission(["site:write"]);
  await connectMongo();
  const updateObj = { updatedBy: user.id, ...input };
  await LegalPage.findOneAndUpdate({ key: input.key }, { $set: updateObj }, { upsert: true, setDefaultsOnInsert: true });
  await writeAuditLog({
    actorId: user.id,
    action: "legal_page.update",
    resourceType: "LegalPage",
    resourceId: input.key,
  });
  revalidatePublic([cacheTags.legalPage], [`/${input.key}`, "/admin/settings/legal"]);
}
