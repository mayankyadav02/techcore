import { unstable_cache } from "next/cache";
import { connectMongo } from "@/lib/db";
import { mapMedia } from "@/lib/public-mappers";
import { cacheTags } from "@/lib/cache-tags";
import { Settings } from "@/modules/content/settings.model";
import { HomeContent } from "@/modules/content/home.model";
import { AboutContent } from "@/modules/content/about.model";
import { PageSeo } from "@/modules/content/page-seo.model";
import { site, socialLinks as fallbackSocial, publicNav as fallbackNav, publicCta as fallbackCta, footerGroups as fallbackFooter } from "@/lib/site";
import { packages as fallbackPackagesList, reasons as fallbackReasonsList, processSteps as fallbackProcessList, homeFaqs as fallbackFaqsList } from "@/lib/content/home";
import { aboutFaqs as fallbackAboutFaqs, values as fallbackValues } from "@/lib/content/about";
export type PublicCompany = {
  name: string;
  tagline: string;
  description: string;
  seoTitle: string;
  email: string;
  phone: string;
  address: string;
  footerText: string;
  social: { href: string; label: string }[];
  logoType: "image" | "text";
  logoText: string;
  logoMedia?: { url: string; altText: string };
  navigation: { href: string; label: string }[];
  cta: { href: string; label: string };
  footerGroups: { title: string; links: { href: string; label: string }[] }[];
};

export const fallbackCompany: PublicCompany = {
  name: site.name,
  tagline: site.tagline,
  description: site.description,
  seoTitle: "",
  email: site.email,
  phone: site.phone,
  address: site.address,
  footerText: "",
  social: [...fallbackSocial],
  logoType: "image",
  logoText: site.name,
  navigation: [...fallbackNav],
  cta: { ...fallbackCta },
  footerGroups: fallbackFooter as unknown as { title: string; links: { href: string; label: string }[] }[],
};

const loadCachedSettings = unstable_cache(
  async () => {
    await connectMongo();
    const row = await Settings.findOne({ key: "global" })
      .populate("logoId")
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

export type PublicHomepage = {
  seoTitle: string;
  seoDescription: string;
  
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroPrimaryUrl: string;
  heroSecondaryLabel: string;
  heroSecondaryUrl: string;
  heroIntro?: string;
  heroImageIds?: string[];
  heroMedia?: { url: string; altText: string }[];

  aboutEyebrow: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutBody: string;
  aboutImageId?: string;
  aboutMedia?: { url: string; altText: string };
  aboutLinkLabel: string;
  aboutLinkUrl: string;

  packagesEyebrow: string;
  packagesTitle: string;
  packagesDescription: string;
  packages: { name: string; audience: string; summary: string; includes: string[]; featured: boolean }[];

  reasonsEyebrow: string;
  reasonsTitle: string;
  reasons: { title: string; body: string }[];

  processEyebrow: string;
  processTitle: string;
  processDescription: string;
  processSteps: { title: string; body: string }[];

  faqEyebrow: string;
  faqTitle: string;
  faqs: { title: string; content: string }[];

  servicesEyebrow: string;
  servicesTitle: string;
  servicesDescription: string;

  solutionsEyebrow: string;
  solutionsTitle: string;
  solutionsDescription: string;

  projectsEyebrow: string;
  projectsTitle: string;
  projectsDescription: string;

  industriesEyebrow: string;
  industriesTitle: string;
  industriesDescription: string;

  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsDescription: string;

  insightsEyebrow: string;
  insightsTitle: string;
  insightsDescription: string;

  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
};

export const fallbackHomepage: PublicHomepage = {
  seoTitle: "",
  seoDescription: "",

  heroEyebrow: "IT services & software",
  heroTitle: "Digital Solutions Built for Businesses That Want to Grow.",
  heroDescription: "TechCore designs and develops modern websites, applications and software solutions that help businesses build stronger digital experiences.",
  heroPrimaryLabel: "Request a Quote",
  heroPrimaryUrl: "/quote",
  heroSecondaryLabel: "Explore Services",
  heroSecondaryUrl: "/services",

  aboutEyebrow: "About",
  aboutTitle: "Technology should solve business problems, not create new ones.",
  aboutDescription: "TechCore is a technology practice for organisations that need websites, applications, and operational software they can actually run. We listen first, then design systems around how the work happens.",
  aboutBody: "Who we are: a delivery team spanning product engineering, design, cloud, and assurance. Why it matters: growth stalls when digital work is treated as decoration. We stay until the first release is usable — and document how the next one should land.",
  aboutLinkLabel: "Know More About TechCore",
  aboutLinkUrl: "/about",

  packagesEyebrow: "Packages",
  packagesTitle: "Start with the shape of the work, not a catalogue price.",
  packagesDescription: "These packages describe typical engagement shapes. They are not live offers with published fees — a Custom Quote follows a real brief.",
  packages: [...fallbackPackagesList].map(p => ({ ...p, featured: p.featured ?? false })),

  reasonsEyebrow: "Why TechCore",
  reasonsTitle: "What you should expect from us.",
  reasons: [...fallbackReasonsList],

  processEyebrow: "Process",
  processTitle: "How a programme typically runs.",
  processDescription: "From the first conversation through support after launch.",
  processSteps: [...fallbackProcessList],

  faqEyebrow: "FAQ",
  faqTitle: "Questions we expect.",
  faqs: [...fallbackFaqsList],

  servicesEyebrow: "Services",
  servicesTitle: "What we build for growing businesses.",
  servicesDescription: "Eight practices under one engineering standard. Each can stand alone or form a programme.",

  solutionsEyebrow: "Solutions",
  solutionsTitle: "Software shaped by how the work actually runs.",
  solutionsDescription: "Sector patterns we see repeatedly. Each page describes the problem, the approach, and the kind of system that follows.",

  projectsEyebrow: "Projects",
  projectsTitle: "Featured programmes.",
  projectsDescription: "ShopFlow, CarePlus, FleetPro, LearnHub, EstatePro, FinServe, GymCore, and FoodHub are fictional cases used to show how TechCore would structure delivery. They are not live client brands.",

  industriesEyebrow: "Industries",
  industriesTitle: "Context before tooling.",
  industriesDescription: "We do not claim to operate these businesses. We claim to listen to how they run before we write software.",

  testimonialsEyebrow: "Testimonials",
  testimonialsTitle: "What a serious buyer would say.",
  testimonialsDescription: "These quotations are fictional and labelled as such. They illustrate tone, not named client results.",

  insightsEyebrow: "Insights",
  insightsTitle: "Writing for people who have to ship.",
  insightsDescription: "Short pieces on delivery and architecture from the practice.",

  ctaTitle: "Have a project in mind?",
  ctaDescription: "Share a short brief. We work discovery-first, treat security as default, and will say honestly whether TechCore is the right team — then what a first release could look like.",
  ctaPrimaryLabel: "Request a Quote",
  ctaPrimaryUrl: "/quote",
  ctaSecondaryLabel: "Talk to TechCore",
  ctaSecondaryUrl: "/contact",
};

const loadCachedHomepage = unstable_cache(
  async () => {
    await connectMongo();
    const row = await HomeContent.findOne({ key: "home" })
      .select("-updatedBy -__v -createdAt -updatedAt")
      .populate("heroImageIds", "url altText")
      .populate("aboutImageId", "url altText")
      .lean();
    return row ? mapHomepage(row as Record<string, unknown>) : fallbackHomepage;
  },
  ["public-homepage"],
  { tags: ["homepage"], revalidate: 3600 },
);

export async function getPublicHomepage(): Promise<PublicHomepage> {
  try {
    return await loadCachedHomepage();
  } catch {
    return fallbackHomepage;
  }
}

function mapJsonArray<T>(
  data: unknown,
  fallback: T[],
): T[] {
  if (Array.isArray(data) && data.length > 0) {
    return data as T[];
  }
  return fallback;
}

export function mapHomepage(row: Record<string, unknown>): PublicHomepage {
  const seo = (row.seo as { title?: string; description?: string }) || {};
  return {
    seoTitle: seo.title || fallbackHomepage.seoTitle,
    seoDescription: seo.description || fallbackHomepage.seoDescription,

    heroEyebrow: (row.heroEyebrow as string) || fallbackHomepage.heroEyebrow,
    heroTitle: (row.heroTitle as string) || fallbackHomepage.heroTitle,
    heroDescription: (row.heroDescription as string) || fallbackHomepage.heroDescription,
    heroPrimaryLabel: (row.heroPrimaryLabel as string) || fallbackHomepage.heroPrimaryLabel,
    heroPrimaryUrl: (row.heroPrimaryUrl as string) || fallbackHomepage.heroPrimaryUrl,
    heroSecondaryLabel: (row.heroSecondaryLabel as string) || fallbackHomepage.heroSecondaryLabel,
    heroSecondaryUrl: (row.heroSecondaryUrl as string) || fallbackHomepage.heroSecondaryUrl,
    heroIntro: (row.heroIntro as string) || "",
    heroImageIds: Array.isArray(row.heroImageIds)
      ? row.heroImageIds.map((id: any) => id?._id?.toString() || id?.toString()).filter(Boolean)
      : undefined,
    heroMedia: Array.isArray(row.heroImageIds)
      ? row.heroImageIds
          .filter((img: any) => img && typeof img === "object" && img.url)
          .map((img: any) => ({ url: img.url as string, altText: img.altText as string }))
      : undefined,

    aboutEyebrow: (row.aboutEyebrow as string) || fallbackHomepage.aboutEyebrow,
    aboutTitle: (row.aboutTitle as string) || fallbackHomepage.aboutTitle,
    aboutDescription: (row.aboutDescription as string) || fallbackHomepage.aboutDescription,
    aboutBody: (row.aboutBody as string) || fallbackHomepage.aboutBody,
    aboutImageId: row.aboutImageId ? (row.aboutImageId as any)?._id?.toString() || row.aboutImageId?.toString() : undefined,
    aboutMedia: row.aboutImageId && typeof row.aboutImageId === "object" && (row.aboutImageId as any).url
      ? { url: (row.aboutImageId as any).url as string, altText: (row.aboutImageId as any).altText as string }
      : undefined,
    aboutLinkLabel: (row.aboutLinkLabel as string) || fallbackHomepage.aboutLinkLabel,
    aboutLinkUrl: (row.aboutLinkUrl as string) || fallbackHomepage.aboutLinkUrl,

    packagesEyebrow: (row.packagesEyebrow as string) || fallbackHomepage.packagesEyebrow,
    packagesTitle: (row.packagesTitle as string) || fallbackHomepage.packagesTitle,
    packagesDescription: (row.packagesDescription as string) || fallbackHomepage.packagesDescription,
    packages: mapJsonArray(row.packages, fallbackHomepage.packages),

    reasonsEyebrow: (row.reasonsEyebrow as string) || fallbackHomepage.reasonsEyebrow,
    reasonsTitle: (row.reasonsTitle as string) || fallbackHomepage.reasonsTitle,
    reasons: mapJsonArray(row.reasons, fallbackHomepage.reasons),

    processEyebrow: (row.processEyebrow as string) || fallbackHomepage.processEyebrow,
    processTitle: (row.processTitle as string) || fallbackHomepage.processTitle,
    processDescription: (row.processDescription as string) || fallbackHomepage.processDescription,
    processSteps: mapJsonArray(row.processSteps, fallbackHomepage.processSteps),

    faqEyebrow: (row.faqEyebrow as string) || fallbackHomepage.faqEyebrow,
    faqTitle: (row.faqTitle as string) || fallbackHomepage.faqTitle,
    faqs: mapJsonArray(row.faqs, fallbackHomepage.faqs),

    servicesEyebrow: (row.servicesEyebrow as string) || fallbackHomepage.servicesEyebrow,
    servicesTitle: (row.servicesTitle as string) || fallbackHomepage.servicesTitle,
    servicesDescription: (row.servicesDescription as string) || fallbackHomepage.servicesDescription,

    solutionsEyebrow: (row.solutionsEyebrow as string) || fallbackHomepage.solutionsEyebrow,
    solutionsTitle: (row.solutionsTitle as string) || fallbackHomepage.solutionsTitle,
    solutionsDescription: (row.solutionsDescription as string) || fallbackHomepage.solutionsDescription,

    projectsEyebrow: (row.projectsEyebrow as string) || fallbackHomepage.projectsEyebrow,
    projectsTitle: (row.projectsTitle as string) || fallbackHomepage.projectsTitle,
    projectsDescription: (row.projectsDescription as string) || fallbackHomepage.projectsDescription,

    industriesEyebrow: (row.industriesEyebrow as string) || fallbackHomepage.industriesEyebrow,
    industriesTitle: (row.industriesTitle as string) || fallbackHomepage.industriesTitle,
    industriesDescription: (row.industriesDescription as string) || fallbackHomepage.industriesDescription,

    testimonialsEyebrow: (row.testimonialsEyebrow as string) || fallbackHomepage.testimonialsEyebrow,
    testimonialsTitle: (row.testimonialsTitle as string) || fallbackHomepage.testimonialsTitle,
    testimonialsDescription: (row.testimonialsDescription as string) || fallbackHomepage.testimonialsDescription,

    insightsEyebrow: (row.insightsEyebrow as string) || fallbackHomepage.insightsEyebrow,
    insightsTitle: (row.insightsTitle as string) || fallbackHomepage.insightsTitle,
    insightsDescription: (row.insightsDescription as string) || fallbackHomepage.insightsDescription,

    ctaTitle: (row.ctaTitle as string) || fallbackHomepage.ctaTitle,
    ctaDescription: (row.ctaDescription as string) || fallbackHomepage.ctaDescription,
    ctaPrimaryLabel: (row.ctaPrimaryLabel as string) || fallbackHomepage.ctaPrimaryLabel,
    ctaPrimaryUrl: (row.ctaPrimaryUrl as string) || fallbackHomepage.ctaPrimaryUrl,
    ctaSecondaryLabel: (row.ctaSecondaryLabel as string) || fallbackHomepage.ctaSecondaryLabel,
    ctaSecondaryUrl: (row.ctaSecondaryUrl as string) || fallbackHomepage.ctaSecondaryUrl,
  };
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
  logoId?: unknown;
  logoType?: string | null;
  logoText?: string | null;
  navigation?: { href: string; label: string }[] | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  footerGroups?: { title: string; links: { href: string; label: string }[] }[] | null;
  socialLinks?: { linkedin?: string | null; x?: string | null } | null;
  defaultSeo?: { title?: string | null; description?: string | null } | null;
}): PublicCompany {
  const social: { href: string; label: string }[] = [];
  if (row.socialLinks?.linkedin) {
    social.push({ href: row.socialLinks.linkedin, label: "LinkedIn" });
  }
  if (row.socialLinks?.x) {
    social.push({ href: row.socialLinks.x, label: "X" });
  }

  const cta = row.ctaLabel && row.ctaUrl 
    ? { label: row.ctaLabel, href: row.ctaUrl } 
    : { ...fallbackCta };

  return {
    name: row.companyName || site.name,
    tagline: row.tagline || site.tagline,
    description: row.defaultSeo?.description || site.description,
    seoTitle: row.defaultSeo?.title || "",
    email: row.contactEmail || site.email,
    phone: row.contactPhone || site.phone,
    address: row.address || site.address,
    footerText: row.footerText ?? "",
    social: social.length ? social : [...fallbackSocial],
    logoType: (row.logoType as "image" | "text") || "image",
    logoText: row.logoText || row.companyName || site.name,
    logoMedia: mapMedia(row as Record<string, unknown>, "logoId"),
    navigation: row.navigation?.length ? row.navigation : [...fallbackNav],
    cta,
    footerGroups: row.footerGroups?.length 
      ? row.footerGroups 
      : (fallbackFooter as unknown as { title: string; links: { href: string; label: string }[] }[]),
  };
}

export type PublicAbout = {
  seoTitle: string;
  seoDescription: string;

  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroPrimaryUrl: string;
  heroSecondaryLabel: string;
  heroSecondaryUrl: string;

  storyEyebrow: string;
  storyTitle: string;
  storyDescription: string;
  storyBody: string;

  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;

  valuesEyebrow: string;
  valuesTitle: string;
  values: { title: string; body: string }[];

  expertiseEyebrow: string;
  expertiseTitle: string;

  approachEyebrow: string;
  approachTitle: string;
  approachDescription: string;

  expectationsEyebrow: string;
  expectationsTitle: string;

  faqEyebrow: string;
  faqTitle: string;
  faqs: { title: string; content: string }[];

  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
};

export const fallbackAbout: PublicAbout = {
  seoTitle: "",
  seoDescription: "",

  heroEyebrow: "Company",
  heroTitle: "A serious technology practice.",
  heroDescription: "TechCore is presented as an independent delivery firm. We design and build digital systems that operations teams can run — and that leadership can explain.",
  heroPrimaryLabel: "Contact Us",
  heroPrimaryUrl: "/contact",
  heroSecondaryLabel: "Explore Services",
  heroSecondaryUrl: "/services",

  storyEyebrow: "Story",
  storyTitle: "Built around delivery, not display.",
  storyDescription: "The firm exists in this demonstration as a response to a familiar pattern: organisations buy software that looks complete and then spend years teaching it their process.",
  storyBody: "TechCore’s story, for the purpose of this site, is a practice that grew by staying on programmes after launch. Architecture, design, and engineering sit in one team so the artefact that ships is the artefact that was promised.",

  missionTitle: "Mission",
  missionBody: "Help organisations replace fragile operational glue with software they can own, inspect, and extend.",
  visionTitle: "Vision",
  visionBody: "A standard of digital work in which public websites, internal tools, and integrations are held to the same quality bar.",

  valuesEyebrow: "Values",
  valuesTitle: "How we choose.",
  values: [...fallbackValues],

  expertiseEyebrow: "Expertise",
  expertiseTitle: "Practices, not a catalogue of buzzwords.",

  approachEyebrow: "Approach",
  approachTitle: "Write the decision, then write the software.",
  approachDescription: "Discovery produces a recommendation a sponsor can accept or reject. Build work starts when the first release is named.",

  expectationsEyebrow: "Why TechCore",
  expectationsTitle: "Expectations.",

  faqEyebrow: "FAQ",
  faqTitle: "Questions we expect.",
  faqs: [...fallbackAboutFaqs],

  ctaTitle: "Have a project in mind?",
  ctaDescription: "Share a short brief. We work discovery-first, treat security as default, and will say honestly whether TechCore is the right team — then what a first release could look like.",
  ctaPrimaryLabel: "Request a Quote",
  ctaPrimaryUrl: "/quote",
  ctaSecondaryLabel: "Talk to TechCore",
  ctaSecondaryUrl: "/contact",
};

const loadCachedAbout = unstable_cache(
  async () => {
    await connectMongo();
    const row = await AboutContent.findOne({ key: "about" })
      .select("-updatedBy -__v -createdAt -updatedAt")
      .lean();
    return row ? mapAbout(row as Record<string, unknown>) : fallbackAbout;
  },
  ["public-about"],
  { tags: [cacheTags.about], revalidate: 3600 },
);

export async function getPublicAbout(): Promise<PublicAbout> {
  try {
    return await loadCachedAbout();
  } catch {
    return fallbackAbout;
  }
}

export function mapAbout(row: Record<string, unknown>): PublicAbout {
  const seo = (row.seo as { title?: string; description?: string }) || {};
  return {
    seoTitle: seo.title || fallbackAbout.seoTitle,
    seoDescription: seo.description || fallbackAbout.seoDescription,

    heroEyebrow: (row.heroEyebrow as string) || fallbackAbout.heroEyebrow,
    heroTitle: (row.heroTitle as string) || fallbackAbout.heroTitle,
    heroDescription: (row.heroDescription as string) || fallbackAbout.heroDescription,
    heroPrimaryLabel: (row.heroPrimaryLabel as string) || fallbackAbout.heroPrimaryLabel,
    heroPrimaryUrl: (row.heroPrimaryUrl as string) || fallbackAbout.heroPrimaryUrl,
    heroSecondaryLabel: (row.heroSecondaryLabel as string) || fallbackAbout.heroSecondaryLabel,
    heroSecondaryUrl: (row.heroSecondaryUrl as string) || fallbackAbout.heroSecondaryUrl,

    storyEyebrow: (row.storyEyebrow as string) || fallbackAbout.storyEyebrow,
    storyTitle: (row.storyTitle as string) || fallbackAbout.storyTitle,
    storyDescription: (row.storyDescription as string) || fallbackAbout.storyDescription,
    storyBody: (row.storyBody as string) || fallbackAbout.storyBody,

    missionTitle: (row.missionTitle as string) || fallbackAbout.missionTitle,
    missionBody: (row.missionBody as string) || fallbackAbout.missionBody,
    visionTitle: (row.visionTitle as string) || fallbackAbout.visionTitle,
    visionBody: (row.visionBody as string) || fallbackAbout.visionBody,

    valuesEyebrow: (row.valuesEyebrow as string) || fallbackAbout.valuesEyebrow,
    valuesTitle: (row.valuesTitle as string) || fallbackAbout.valuesTitle,
    values: Array.isArray(row.values) ? row.values as { title: string; body: string }[] : fallbackAbout.values,

    expertiseEyebrow: (row.expertiseEyebrow as string) || fallbackAbout.expertiseEyebrow,
    expertiseTitle: (row.expertiseTitle as string) || fallbackAbout.expertiseTitle,

    approachEyebrow: (row.approachEyebrow as string) || fallbackAbout.approachEyebrow,
    approachTitle: (row.approachTitle as string) || fallbackAbout.approachTitle,
    approachDescription: (row.approachDescription as string) || fallbackAbout.approachDescription,

    expectationsEyebrow: (row.expectationsEyebrow as string) || fallbackAbout.expectationsEyebrow,
    expectationsTitle: (row.expectationsTitle as string) || fallbackAbout.expectationsTitle,

    faqEyebrow: (row.faqEyebrow as string) || fallbackAbout.faqEyebrow,
    faqTitle: (row.faqTitle as string) || fallbackAbout.faqTitle,
    faqs: Array.isArray(row.faqs) ? row.faqs as { title: string; content: string }[] : fallbackAbout.faqs,

    ctaTitle: (row.ctaTitle as string) || fallbackAbout.ctaTitle,
    ctaDescription: (row.ctaDescription as string) || fallbackAbout.ctaDescription,
    ctaPrimaryLabel: (row.ctaPrimaryLabel as string) || fallbackAbout.ctaPrimaryLabel,
    ctaPrimaryUrl: (row.ctaPrimaryUrl as string) || fallbackAbout.ctaPrimaryUrl,
    ctaSecondaryLabel: (row.ctaSecondaryLabel as string) || fallbackAbout.ctaSecondaryLabel,
    ctaSecondaryUrl: (row.ctaSecondaryUrl as string) || fallbackAbout.ctaSecondaryUrl,
  };
}

const loadCachedPageSeo = unstable_cache(
  async () => {
    await connectMongo();
    const rows = await PageSeo.find().lean();
    const dictionary: Record<string, { seoTitle: string; seoDescription: string }> = {};
    for (const row of rows) {
      dictionary[row.page] = {
        seoTitle: row.seo?.title || "",
        seoDescription: row.seo?.description || "",
      };
    }
    return dictionary;
  },
  ["public-page-seo"],
  { tags: [cacheTags.pageSeo], revalidate: 3600 },
);

export async function getAllPublicPageSeo(): Promise<Record<string, { seoTitle: string; seoDescription: string }>> {
  try {
    return await loadCachedPageSeo();
  } catch {
    return {};
  }
}
