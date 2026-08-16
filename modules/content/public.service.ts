import { unstable_cache } from "next/cache";
import { connectMongo } from "@/lib/db";
import { cacheTags } from "@/lib/cache-tags";
import { Settings } from "@/modules/content/settings.model";
import { site, socialLinks as fallbackSocial } from "@/lib/site";

export type PublicCompany = {
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  footerText: string;
  social: { href: string; label: string }[];
};

export const fallbackCompany: PublicCompany = {
  name: site.name,
  tagline: site.tagline,
  description: site.description,
  email: site.email,
  phone: site.phone,
  address: site.address,
  footerText: "",
  social: [...fallbackSocial],
};

const loadCachedSettings = unstable_cache(
  async () => {
    await connectMongo();
    const row = await Settings.findOne({ key: "global" })
      .select("-updatedBy -__v")
      .lean();
    return row ? mapSettings(row) : fallbackCompany;
  },
  ["public-settings"],
  { tags: [cacheTags.settings], revalidate: 3600 },
);

export function clearPublicSettingsCache() {
  // Tag revalidation in admin.service is the source of truth.
}

export async function getPublicSettings(): Promise<PublicCompany> {
  return loadCachedSettings();
}

export async function getPublicCompany(): Promise<PublicCompany> {
  try {
    return await getPublicSettings();
  } catch {
    return fallbackCompany;
  }
}

function mapSettings(row: {
  companyName?: string;
  tagline?: string | null;
  contactEmail?: string;
  contactPhone?: string | null;
  address?: string | null;
  footerText?: string | null;
  socialLinks?: { linkedin?: string | null; x?: string | null } | null;
  defaultSeo?: { description?: string | null } | null;
}): PublicCompany {
  const social: { href: string; label: string }[] = [];
  if (row.socialLinks?.linkedin) {
    social.push({ href: row.socialLinks.linkedin, label: "LinkedIn" });
  }
  if (row.socialLinks?.x) {
    social.push({ href: row.socialLinks.x, label: "X" });
  }

  return {
    name: row.companyName || site.name,
    tagline: row.tagline || site.tagline,
    description: row.defaultSeo?.description || site.description,
    email: row.contactEmail || site.email,
    phone: row.contactPhone || site.phone,
    address: row.address || site.address,
    footerText: row.footerText ?? "",
    social: social.length ? social : [...fallbackSocial],
  };
}
