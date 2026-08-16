import type { IconName, Service } from "@/lib/content/services";
import type { Solution } from "@/lib/content/solutions";
import {
  getProject,
  type Project,
  type ProjectKind,
  type ProjectTimelinePhase,
} from "@/lib/content/projects";
import type { Industry } from "@/lib/content/industries";
import type { Post } from "@/lib/content/posts";
import type { Job } from "@/lib/content/jobs";
import { blogCategories, type BlogCategory } from "@/lib/content/posts";

const iconNames: IconName[] = [
  "web",
  "mobile",
  "software",
  "ai",
  "cloud",
  "design",
  "security",
  "consulting",
];

export function isIconName(value: unknown): value is IconName {
  return typeof value === "string" && iconNames.includes(value as IconName);
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n+/)
      .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

export function asParagraphs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);
  }
  return [];
}

export function formatPublicDate(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function seoFields(doc: Record<string, unknown>) {
  const seo = doc.seo;
  if (!seo || typeof seo !== "object") {
    return { seoTitle: undefined as string | undefined, seoDescription: undefined as string | undefined };
  }
  const fields = seo as { title?: unknown; description?: unknown };
  return {
    seoTitle: typeof fields.title === "string" && fields.title.trim() ? fields.title : undefined,
    seoDescription:
      typeof fields.description === "string" && fields.description.trim()
        ? fields.description
        : undefined,
  };
}

export type PublicService = Service & {
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
export type PublicSolution = Solution & {
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
export type PublicProject = Project & {
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
export type PublicIndustry = Industry & {
  body?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
export type PublicPost = Post & {
  featured?: boolean;
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
};
export type PublicJob = Job & {
  id: string;
  benefits?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export function hasPublicCard(item: { slug?: string; title?: string }) {
  return Boolean(item.slug?.trim() && item.title?.trim());
}

export function featuredThenFill<T extends { featured?: boolean }>(items: T[], n: number): T[] {
  const featured = items.filter((item) => item.featured);
  const rest = items.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, n);
}
export type PublicTestimonial = {
  quote: string;
  name: string;
  role: string;
};

export function mapService(doc: Record<string, unknown>): PublicService {
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    summary: str(doc.summary),
    overview: str(doc.body) || str(doc.overview),
    capabilities: asStringArray(doc.highlights ?? doc.capabilities),
    features: asStringArray(doc.features),
    technologies: asStringArray(doc.technologies),
    benefits: asStringArray(doc.benefits),
    process: asStringArray(doc.process),
    faqs: Array.isArray(doc.faqs)
      ? doc.faqs
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const faq = item as { title?: unknown; content?: unknown };
            if (!faq.title || !faq.content) return null;
            return { title: String(faq.title), content: String(faq.content) };
          })
          .filter((item): item is { title: string; content: string } => Boolean(item))
      : [],
    icon: isIconName(doc.icon) ? doc.icon : "consulting",
    featured: Boolean(doc.featured),
    ...seoFields(doc),
  };
}

export function mapSolution(doc: Record<string, unknown>): PublicSolution {
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    summary: str(doc.summary),
    problem: str(doc.problem),
    approach: str(doc.approach) || str(doc.body),
    implementation: str(doc.implementation) || undefined,
    features: asStringArray(doc.features),
    technology: asStringArray(doc.technology),
    benefits: asStringArray(doc.outcomes ?? doc.benefits),
    featured: Boolean(doc.featured),
    ...seoFields(doc),
  };
}

function asMetrics(value: unknown): { label: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const metric = item as { label?: unknown; value?: unknown };
    if (typeof metric.label !== "string" || typeof metric.value !== "string") return [];
    const label = metric.label.trim();
    const metricValue = metric.value.trim();
    if (!label || !metricValue) return [];
    return [{ label, value: metricValue }];
  });
}

function asTimeline(value: unknown): ProjectTimelinePhase[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const phase = item as { label?: unknown; window?: unknown; detail?: unknown };
    if (typeof phase.label !== "string" || typeof phase.window !== "string") return [];
    return [
      {
        label: phase.label,
        window: phase.window,
        detail: typeof phase.detail === "string" ? phase.detail : "",
      },
    ];
  });
}

const projectKinds: ProjectKind[] = [
  "Demo Project",
  "Concept Project",
  "Fictional Case Study",
];

function asProjectKind(value: unknown): ProjectKind | undefined {
  return typeof value === "string" && projectKinds.includes(value as ProjectKind)
    ? (value as ProjectKind)
    : undefined;
}

/** Merge CMS fields with presentation extras from static content (approach, timeline, filter slugs). */
export function enrichProjectPresentation(project: PublicProject): PublicProject {
  const extra = getProject(project.slug);
  if (!extra) {
    return {
      ...project,
      kind: project.kind ?? "Fictional Case Study",
      pitch: project.pitch || project.summary,
    };
  }
  return {
    ...project,
    kind: project.kind ?? extra.kind ?? "Fictional Case Study",
    pitch: project.pitch || extra.pitch || project.summary,
    approach: project.approach || extra.approach,
    timeline: project.timeline?.length ? project.timeline : extra.timeline,
    metrics: project.metrics?.length ? project.metrics : extra.metrics,
    mockups: project.mockups?.length ? project.mockups : extra.mockups,
    mockupLayout: project.mockupLayout ?? extra.mockupLayout,
    industrySlug: project.industrySlug || extra.industrySlug,
    solutionSlug: project.solutionSlug || extra.solutionSlug,
    serviceSlugs: project.serviceSlugs?.length ? project.serviceSlugs : extra.serviceSlugs,
  };
}

export function mapProject(doc: Record<string, unknown>): PublicProject {
  const galleryCaptions = asStringArray(doc.galleryUrls).filter(
    (item) => !/^https?:\/\//i.test(item),
  );
  const mapped: PublicProject = {
    slug: str(doc.slug),
    title: str(doc.title),
    sector: str(doc.sector),
    summary: str(doc.summary),
    overview: str(doc.overview),
    challenge: str(doc.challenge),
    solution: str(doc.solution),
    approach: str(doc.approach) || undefined,
    features: asStringArray(doc.features),
    technology: asStringArray(doc.technology),
    results: asStringArray(doc.results),
    metrics: asMetrics(doc.metrics),
    mockups: asStringArray(doc.mockups).length ? asStringArray(doc.mockups) : galleryCaptions,
    kind: asProjectKind(doc.kind),
    pitch: str(doc.pitch) || undefined,
    timeline: asTimeline(doc.timeline),
    industrySlug: str(doc.industrySlug) || undefined,
    solutionSlug: str(doc.solutionSlug) || undefined,
    serviceSlugs: asStringArray(doc.serviceSlugs),
    featured: Boolean(doc.featured),
    ...seoFields(doc),
  };
  return enrichProjectPresentation(mapped);
}

export function mapIndustry(doc: Record<string, unknown>): PublicIndustry {
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    summary: str(doc.summary),
    body: str(doc.body),
    focus: asStringArray(doc.focus),
    featured: Boolean(doc.featured),
    ...seoFields(doc),
  };
}

export function mapPost(doc: Record<string, unknown>): PublicPost {
  const category = str(doc.category);
  const known = blogCategories.find((item) => item === category);
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    excerpt: str(doc.excerpt),
    category: (known ?? category) as BlogCategory,
    date: formatPublicDate(doc.publishedAt) || str(doc.date),
    readTime: str(doc.readTime) || "5 min",
    body: asParagraphs(doc.body),
    featured: Boolean(doc.featured),
    authorName: str(doc.authorName),
    ...seoFields(doc),
  };
}

export function mapJob(doc: Record<string, unknown>): PublicJob {
  return {
    id: str(doc.id) || str(doc._id),
    slug: str(doc.slug),
    title: str(doc.title),
    department: str(doc.department),
    location: str(doc.location),
    employmentType: str(doc.employmentType),
    experience: str(doc.experience),
    description: str(doc.description),
    responsibilities: asStringArray(doc.responsibilities),
    requirements: asStringArray(doc.requirements),
    skills: asStringArray(doc.skills),
    benefits: asStringArray(doc.benefits),
    ...seoFields(doc),
  };
}

export function mapTestimonial(doc: Record<string, unknown>): PublicTestimonial {
  const role = [str(doc.authorRole), str(doc.company)].filter(Boolean).join(", ");
  return {
    quote: str(doc.quote),
    name: str(doc.authorName) || str(doc.name),
    role,
  };
}

export function hasPublicTestimonial(item: PublicTestimonial) {
  return Boolean(item.quote.trim() && item.name.trim());
}

export function mapPublicServices(rows: object[]) {
  return rows.map((row) => mapService(row as Record<string, unknown>)).filter(hasPublicCard);
}

export function mapPublicSolutions(rows: object[]) {
  return rows.map((row) => mapSolution(row as Record<string, unknown>)).filter(hasPublicCard);
}

export function mapPublicIndustries(rows: object[]) {
  return rows.map((row) => mapIndustry(row as Record<string, unknown>)).filter(hasPublicCard);
}

export function mapPublicProjects(rows: object[]) {
  return rows.map((row) => mapProject(row as Record<string, unknown>)).filter(hasPublicCard);
}

export function mapPublicPosts(rows: object[]) {
  return rows.map((row) => mapPost(row as Record<string, unknown>)).filter(hasPublicCard);
}

export function mapPublicJobs(rows: object[]) {
  return rows.map((row) => mapJob(row as Record<string, unknown>)).filter(hasPublicCard);
}

export function mapPublicTestimonials(rows: object[]) {
  return rows.map((row) => mapTestimonial(row as Record<string, unknown>)).filter(hasPublicTestimonial);
}
