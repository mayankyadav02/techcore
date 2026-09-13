import { unstable_cache } from "next/cache";
import { connectMongo } from "@/lib/db";
import { cacheTags } from "@/lib/cache-tags";
import { Settings } from "@/modules/content/settings.model";
import { HomeContent } from "@/modules/content/home.model";
import { site, socialLinks as fallbackSocial, publicNav as fallbackNav, publicCta as fallbackCta, footerGroups as fallbackFooter } from "@/lib/site";
import { packages as fallbackPackagesList, reasons as fallbackReasonsList, processSteps as fallbackProcessList, homeFaqs as fallbackFaqsList } from "@/lib/content/home";
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
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroPrimaryUrl: string;
  heroSecondaryLabel: string;
  heroSecondaryUrl: string;

  aboutEyebrow: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutBody: string;
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
  return {
    heroEyebrow: (row.heroEyebrow as string) || fallbackHomepage.heroEyebrow,
    heroTitle: (row.heroTitle as string) || fallbackHomepage.heroTitle,
    heroDescription: (row.heroDescription as string) || fallbackHomepage.heroDescription,
    heroPrimaryLabel: (row.heroPrimaryLabel as string) || fallbackHomepage.heroPrimaryLabel,
    heroPrimaryUrl: (row.heroPrimaryUrl as string) || fallbackHomepage.heroPrimaryUrl,
    heroSecondaryLabel: (row.heroSecondaryLabel as string) || fallbackHomepage.heroSecondaryLabel,
    heroSecondaryUrl: (row.heroSecondaryUrl as string) || fallbackHomepage.heroSecondaryUrl,

    aboutEyebrow: (row.aboutEyebrow as string) || fallbackHomepage.aboutEyebrow,
    aboutTitle: (row.aboutTitle as string) || fallbackHomepage.aboutTitle,
    aboutDescription: (row.aboutDescription as string) || fallbackHomepage.aboutDescription,
    aboutBody: (row.aboutBody as string) || fallbackHomepage.aboutBody,
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
    navigation: row.navigation?.length ? row.navigation : [...fallbackNav],
    cta,
    footerGroups: row.footerGroups?.length 
      ? row.footerGroups 
      : (fallbackFooter as unknown as { title: string; links: { href: string; label: string }[] }[]),
  };
}
